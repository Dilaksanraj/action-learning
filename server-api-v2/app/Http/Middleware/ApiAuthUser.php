<?php

namespace App\Http\Middleware;

use Illuminate\Support\Facades\Auth;
use Closure;
use Illuminate\Http\Request;
use RequestHelper;
use App\Enums\RequestType;
use LocalizationHelper;

class ApiAuthUser
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        $user = Auth('api')->user();

            if(!$user->accesible){
                return response()->json(
                    RequestHelper::sendResponse(
                        RequestType::CODE_401,
                        LocalizationHelper::getTranslatedText('auth.token_expired')
                ), RequestType::CODE_401);
            }

        return $next($request);
    }
}
