import facebookLogin from './facebookAuth';
import googleLogin from './googleAuth';
import emailLogin from './emailLogin';
import emailRegister from './emailRegister';
import normalizeUserData from './normalizeUserData';
import fetchOpenFoodFactsAPI from './fetchOpenFoodFactsAPI';
import fetchProducts from './fetchProducts';

module.exports = {
	facebookLogin,
	googleLogin,
    emailLogin,
    emailRegister,
    normalizeUserData,
    fetchOpenFoodFactsAPI,
    fetchProducts
};
