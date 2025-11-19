import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { InventoryPage } from '../pages/inventory.page';
import { CartPage } from '../pages/cart.page';
import { CheckoutStepOnePage } from '../pages/checkoutStepOne.page';
import { CheckoutStepTwoPage } from '../pages/checkoutStepTwo.page';
import { CheckoutCompletePage } from '../pages/checkoutComplete.page';

test('@ui Автоматизация E2E сценария покупки с POM', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutStepOne = new CheckoutStepOnePage(page);
    const checkoutStepTwo = new CheckoutStepTwoPage(page);
    const checkoutComplete = new CheckoutCompletePage(page);

    await loginPage.open();
    await loginPage.login('standard_user', 'secret_sauce');

    await inventoryPage.sortByHighToLow();
    const addedItemName = await inventoryPage.addFirstItemToCart();

    await inventoryPage.openCart();

    const itemInCart = await cartPage.getFirstItemName();
    expect(itemInCart).toBe(addedItemName);

    await cartPage.goToCheckout();
    await checkoutStepOne.fillUserInfo('Test', 'User', '12345');
    await checkoutStepTwo.finishCheckout();

    const successMessage = await checkoutComplete.getCompletionMessage();
    expect(successMessage).toBe('Thank you for your order!');
});
