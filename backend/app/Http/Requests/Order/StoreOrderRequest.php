<?php

namespace App\Http\Requests\Order;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'shipping_address'     => ['required', 'string', 'max:500'],
            'shipping_city'        => ['required', 'string', 'max:100'],
            'shipping_country'     => ['required', 'string', 'size:2'],
            'shipping_postal_code' => ['required', 'string', 'max:20'],
            'payment_method'       => ['required', 'in:stripe,razorpay,cod'],
            'notes'                => ['nullable', 'string', 'max:500'],
        ];
    }
}