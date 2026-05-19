import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Product } from '../../../../../Types/type';
import { ProductService } from './productService';

@Injectable({
  providedIn: 'root',
})
export class StylistSearchService {
  productService = inject(ProductService);

  private async ensureProductsLoaded(): Promise<void> {
    if (!this.productService.products().length) {
      await this.productService.getProductsAsync();
    }
  }

  catalog: string = '';

  async searchText(text: String): Promise<unknown[]> {
    await this.ensureProductsLoaded();
    const products = this.productService.products();
    console.log('Products for stylist search:', products);
    this.catalog = (products ?? [])
      .map((p) => {
        const priceLabel = p.oldPrice
          ? `${p.currentPrice} (was ${p.oldPrice})`
          : `${p.currentPrice}`;
        return `id: ${p.id} | title: ${p.title} | category: ${p.category} | brand: ${p.brand} | price: ${priceLabel} | sizes: ${p.availableSizes.join(', ')} | tags: ${p.tags.join(', ')} | stock: ${p.stock}`;
      })
      .join('\n');
    console.log('catalog ', this.catalog);
    const message = `User Search: "${text}"\n\nAnalyze this search prompt. Identify the garment(s), style, color palette, and vibe. Then from the catalog below, return ONLY the 3 most visually similar product IDs as a JSON array of numeric values. Do not include any other text, only the JSON array.\n\nCATALOG:\n${this.catalog}`;

    const body = {
      model: environment.MistralModel,
      stream: false,
      messages: [
        {
          role: 'system',
          content:
            'You are a stylist assistant. Analyze prompts like a fashion stylist and return the four most visually similar products from the catalog as clean JSON.',
        },
        {
          role: 'user',
          content: message,
        },
      ],
    };

    try {
      const response = await fetch(environment.MistralApiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${environment.MistralApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`Mistral API error: ${response.status}`);
      }

      const data = await response.json();
      const content =
        data?.choices?.[0]?.message?.content ||
        data?.choices?.[0]?.content?.[0]?.text ||
        data?.choices?.[0]?.text ||
        null;

      if (typeof content === 'string') {
        console.log('Mistral search response:', content);
        return this.extractTop3Products(content, products);
      }

      throw new Error('Unexpected Mistral response format');
    } catch (error) {
      console.error('Mistral text response failed:', error);
      return [];
    }
  }

  private extractTop3Products(content: string, products: Product[]): unknown[] {
    console.log(products);
    const jsonBlockMatch = content.match(/```json\s*([\s\S]*?)```/i);
    const candidate = jsonBlockMatch ? jsonBlockMatch[1] : content;
    const arrayMatch = candidate.match(/\[[\s\S]*\]/);

    if (!arrayMatch) {
      throw new Error('Could not find a JSON array in the Mistral response');
    }

    const jsonText = arrayMatch[0];
    const parsed = JSON.parse(jsonText);

    if (!Array.isArray(parsed)) {
      throw new Error('Parsed Mistral result is not a JSON array');
    }

    return parsed
      .slice(0, 3)
      .map((id) => {
        if (typeof id === 'number') {
          return id;
        }
        if (typeof id === 'string') {
          const parsedId = Number(id.trim());
          if (!Number.isNaN(parsedId)) {
            return parsedId;
          }
        }
        throw new Error('Parsed product id must be a numeric value');
      })
      .map((id) => products.find((p) => p.id == id));
  }
}
