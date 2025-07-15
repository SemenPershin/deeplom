<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class FilmStoreRequest extends FormRequest
{

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'time' => 'required|integer|max:1440',
            'description' => 'required|string|max:255',
            'country' => 'required|string|max:255',
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'Название фильма обязательно для заполнения',
            'name.max' => 'Название фильма не должно превышать 255 символов',

            'time.required' => 'Время фильма обязательно для заполнения',
            'time.integer' => 'В этой строке могут быть только цифры',
            'time.max' => 'Время не должно превышать 1440 минут',

            'description.required' => 'Описание фильма обязательно для заполнения',
            'description.max' => 'Описание фильма не должно превышать 255 символов',

            'country.required' => 'Страна фильма обязательно для заполнения',
            'country.max' => 'Название страны не должно превышать 255 символов',
        ];
    }

}
