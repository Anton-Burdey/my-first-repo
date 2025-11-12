import { expect } from '@playwright/test';

export class InventoryPage {
    constructor(page) {
        this.page = page;
        this.title = page.locator('.title');
        this.sortSelect = page.locator('[data-test="product-sort-container"]');
        this.cartIcon = page.locator('.shopping_cart_link');
        this.items = page.locator('.inventory_item');
    }

    async getPageTitle() {
        await this.title.waitFor({ state: 'visible', timeout: 15000 });
        return await this.title.textContent();
    }

    async sortByHighToLow() {
        await this.sortSelect.waitFor({ state: 'visible', timeout: 20000 });
        await this.sortSelect.selectOption('hilo');
    }

    async addFirstItemToCart() {
        const firstItemName = await this.items.first().locator('.inventory_item_name').textContent();
        const firstAddButton = this.items.first().locator('button');
        await firstAddButton.click();
        return firstItemName.trim();
    }

    async openCart() {
        await this.cartIcon.click();
    }
}
