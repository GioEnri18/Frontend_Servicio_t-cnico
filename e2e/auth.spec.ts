import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Ensure we start from a clean state
    await page.goto('http://localhost:5173/');
    // Clear cookies to ensure no lingering session
    await page.context().clearCookies();
  });

  test('Guest can navigate to public pages', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await expect(page.locator('h1', { hasText: 'Soluciones Tecnológicas a tu Medida' })).toBeVisible();

    await page.goto('http://localhost:5173/about');
    await expect(page.locator('h1', { hasText: 'Sobre Nosotros' })).toBeVisible();

    // Assuming /services also shows the dashboard content for now
    await page.goto('http://localhost:5173/services');
    await expect(page.locator('h1', { hasText: 'Soluciones Tecnológicas a tu Medida' })).toBeVisible();
  });

  test('Non-authenticated user is redirected to login from protected route', async ({ page }) => {
    await page.goto('http://localhost:5173/profile');
    await expect(page).toHaveURL('http://localhost:5173/login');
    await expect(page.locator('h1', { hasText: 'Iniciar Sesión' })).toBeVisible();
  });

  test('Successful login and navigation to dashboard', async ({ page }) => {
    await page.goto('http://localhost:5173/login');

    await page.fill('input[type="email"]', 'admin@tedics.com'); // Use a valid test user
    await page.fill('input[type="password"]', 'tedics123'); // Use a valid test password
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('http://localhost:5173/');
    await expect(page.locator('h1', { hasText: 'Soluciones Tecnológicas a tu Medida' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Perfil' })).toBeVisible();
  });

  test('Authenticated user can logout', async ({ page }) => {
    // First, log in
    await page.goto('http://localhost:5173/login');
    await page.fill('input[type="email"]', 'admin@tedics.com');
    await page.fill('input[type="password"]', 'tedics123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('http://localhost:5173/');

    // Navigate to profile page to find logout button
    await page.getByRole('button', { name: 'Perfil' }).click();
    await expect(page).toHaveURL('http://localhost:5173/profile');

    await page.getByRole('button', { name: 'Cerrar Sesión' }).click();
    await expect(page).toHaveURL('http://localhost:5173/login');
    await expect(page.locator('h1', { hasText: 'Iniciar Sesión' })).toBeVisible();
  });

  test('Non-admin user cannot access admin routes', async ({ page }) => {
    // Assuming 'user@tedics.com' is a non-admin user
    // First, register a non-admin user if needed, or use an existing one
    // For this test, we'll assume a user with role 'user' exists and can log in.
    // If not, this test will need to be adapted or a user created via API.

    // Log in as a regular user (assuming 'user@tedics.com' is a valid non-admin user)
    await page.goto('http://localhost:5173/login');
    await page.fill('input[type="email"]', 'user@tedics.com'); 
    await page.fill('input[type="password"]', 'tedics123'); 
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('http://localhost:5173/');

    // Attempt to navigate to an admin route
    await page.goto('http://localhost:5173/admin/quotes');
    // Expect to be redirected to the home page (as per RoleRoute logic)
    await expect(page).toHaveURL('http://localhost:5173/');
  });

  test('Admin user can access admin routes', async ({ page }) => {
    // Log in as an admin user
    await page.goto('http://localhost:5173/login');
    await page.fill('input[type="email"]', 'admin@tedics.com');
    await page.fill('input[type="password"]', 'tedics123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('http://localhost:5173/');

    // Navigate to an admin route
    await page.goto('http://localhost:5173/admin/quotes');
    // Expect to be on the admin quotes page
    await expect(page).toHaveURL('http://localhost:5173/admin/quotes');
    await expect(page.locator('h1', { hasText: 'Gestión de Cotizaciones' })).toBeVisible();
  });
});
