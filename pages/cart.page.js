import { expect } from '@playwright/test';

export class CartPage {
    constructor(page) {
        this.page = page;
        this.cartItems = page.locator('.cart_item');
        this.checkoutButton = page.locator('[data-test="checkout"]');
    }

    async getFirstItemName() {
        return (await this.cartItems.first().locator('.inventory_item_name').textContent()).trim();
    }

    async goToCheckout() {
        await this.checkoutButton.click();
    }
}
