<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class OauthController extends Controller
{
    public function redirect(string $provider): RedirectResponse
    {
        return Socialite::driver($provider)->redirect();
    }

    public function  callback(string $provider): RedirectResponse
    {
        // GET OAUTH USER
        $oauthUser = Socialite::driver($provider)->user();


        // CHECK IF USER EXIST = LOGIN, DOESN'T EXIST = CREATE NEW
        $user = User::query()->firstOrCreate([
            'email' => $oauthUser->getEmail(),
        ], [
            'avatar' => $oauthUser->getAvatar(),
            'name' => $oauthUser->getName(),
        ]);

        Auth::login($user);

        // REDIRECT
        return redirect('/');
    }
}
