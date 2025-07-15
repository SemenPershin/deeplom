<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{

    public function login (Request $request)
    {
        
        
        $userData = $request->only('email', 'password');
        if (Auth::attempt($userData)) {
            $request->session()->regenerate();
            return redirect('admin');
        } else {
            return redirect('login');
        };
    }

}
