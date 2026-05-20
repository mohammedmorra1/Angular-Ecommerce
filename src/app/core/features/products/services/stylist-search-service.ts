import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Product } from '../../../../../Types/type';
import { ProductService } from './productService';
import { extractTop3Products } from '../utils';
@Injectable({
  providedIn: 'root',
})
export class StylistSearchService {
  productService = inject(ProductService);

  catalog: string = '';

  async searchText(text: String): Promise<unknown[]> {
    const products = this.productService.products();
    this.catalog = (products ?? [])
      .map((p) => {
        const priceLabel = p.oldPrice
          ? `${p.currentPrice} (was ${p.oldPrice})`
          : `${p.currentPrice}`;
        return `id: ${p.id} | title: ${p.title} | category: ${p.category} | brand: ${p.brand} | price: ${priceLabel} | sizes: ${p.availableSizes.join(', ')} | tags: ${p.tags.join(', ')} | stock: ${p.stock}`;
      })
      .join('\n');
    const message = `User Search: "${text}"\n\nAnalyze this search prompt. Identify the garment(s), style, color palette, and vibe. Then from the catalog below, return ONLY the 3 most visually similar product IDs as a JSON array of numeric values. Do not include any other text, only the JSON array.\n\nCATALOG:\n${this.catalog}`;

    const body = {
      model: environment.TextModel,
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
        return extractTop3Products(content, products);
      }

      throw new Error('Unexpected Mistral response format');
    } catch (error) {
      return [];
    }
  }
  async searchImage(imageUrl: string): Promise<unknown[]> {
    const products = this.productService.products();
    if (!imageUrl) {
      return [];
    }

    this.catalog = (products ?? [])
      .map((p) => {
        const priceLabel = p.oldPrice
          ? `${p.currentPrice} (was ${p.oldPrice})`
          : `${p.currentPrice}`;
        return `id: ${p.id} | title: ${p.title} | category: ${p.category} | brand: ${p.brand} | price: ${priceLabel} | sizes: ${p.availableSizes.join(', ')} | tags: ${p.tags.join(', ')} | stock: ${p.stock}`;
      })
      .join('\n');

    const body = {
      model: environment.ImageModel,
      stream: false,
      messages: [
        {
          role: 'system',
          content:
            'You are a stylist assistant. Analyze images like a fashion stylist and return the four most visually similar products from the catalog as clean JSON.',
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analyze this fashion image. Identify the garment(s), style, color palette, and vibe. Then from the catalog below, , return ONLY the 3 most visually similar product IDs as a JSON array of numeric values. Do not include any other text, only the JSON array.\n\nCATALOG:\n${this.catalog}`,
            },
            {
              type: 'image_url',
              image_url: {
                url: imageUrl,
              },
            },
          ],
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
        return extractTop3Products(content, products);
      }

      throw new Error('Unexpected Mistral response format');
    } catch (error) {
      return [];
    }
  }
}
