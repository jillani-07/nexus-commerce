<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        return [
            'category_id'    => ['required', 'uuid', 'exists:categories,id'],
            'name'           => ['required', 'string', 'max:255'],
            'description'    => ['nullable', 'string', 'max:5000'],
            'sku'            => ['required', 'string', 'unique:products,sku', 'max:100'],
            'price'          => ['required', 'numeric', 'min:0', 'max:999999'],
            'sale_price'     => ['nullable', 'numeric', 'min:0', 'lt:price'],
            'stock_quantity' => ['required', 'integer', 'min:0'],
            'is_featured'    => ['boolean'],
            'attributes'     => ['nullable', 'array'],
        ];
    }
}