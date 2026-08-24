import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

async function openCaseStudy(page: Page) {
  await page.goto("/");
  const businessNavigation = page.getByRole("button", { name: /Bom Negócio 0\/5 aprovados/ });
  await businessNavigation.focus();
  await page.keyboard.press("Enter");
  await page.getByRole("button", { name: /Explorar Caso Prático/ }).click();
  await expect(page.getByRole("dialog", { name: "Caso Prático de Bom Negócio" })).toBeVisible();
}

test("permite abrir um conteúdo com o teclado e mantém o foco no diálogo", async ({ page }) => {
  await openCaseStudy(page);

  const panel = page.getByRole("dialog", { name: "Caso Prático de Bom Negócio" });
  const closeButton = panel.getByRole("button", { name: "Fechar conteúdo" });
  await expect(closeButton).toBeFocused();

  await page.keyboard.press("Shift+Tab");
  await expect(panel.getByRole("button", { name: "Próximo" })).toBeFocused();
});

test("renderiza a tabela Markdown com colunas e deslocamento seguro", async ({ page }) => {
  await openCaseStudy(page);

  const table = page.locator(".markdown-table-wrap table");
  await expect(table).toHaveCount(1);
  await expect(table.getByRole("columnheader", { name: "Empresa A" })).toBeVisible();
  await expect(table.getByRole("columnheader", { name: "Empresa B" })).toBeVisible();
});

test("mantém a abertura de conteúdo funcional com o movimento pausado", async ({ page }) => {
  await page.goto("/");
  const motionControl = page.getByRole("button", { name: /Movimento/ });
  await expect(motionControl).toHaveAttribute("aria-pressed", "true");
  await motionControl.click();
  await expect(motionControl).toHaveAttribute("aria-pressed", "false");

  await page.getByRole("button", { name: /Bom Negócio 0\/5 aprovados/ }).click();
  await page.getByRole("button", { name: /Explorar Caso Prático/ }).click();
  await expect(page.getByRole("dialog", { name: "Caso Prático de Bom Negócio" })).toBeVisible();
});

test("reinicia somente o progresso local após confirmação", async ({ page }) => {
  await openCaseStudy(page);
  await page.getByRole("dialog", { name: "Caso Prático de Bom Negócio" })
    .getByRole("button", { name: "Próximo" })
    .click();

  await page.getByRole("button", { name: "Fechar conteúdo" }).click();

  const resetControl = page.getByRole("button", { name: "Reiniciar progresso" });
  await expect(resetControl).toBeVisible();
  page.once("dialog", (dialog) => dialog.accept());
  await resetControl.click();

  await expect(resetControl).toBeHidden();
  await expect(page.getByRole("button", { name: "Certificado 0/24" })).toBeVisible();
});

test("não apresenta violações críticas ou graves de acessibilidade", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page }).analyze();
  const blockingViolations = results.violations.filter(
    (violation) => violation.impact === "critical" || violation.impact === "serious",
  );

  expect(blockingViolations).toEqual([]);
});

test.describe("em ecrã pequeno", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("mantém os nós da rede dentro da área visível", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /Bom Negócio 0\/5 aprovados/ }).click();

    const nodeOrbs = page.locator(".knowledge-nodes .node-orb");
    await expect(nodeOrbs).not.toHaveCount(0);
    const isEveryNodeVisible = await nodeOrbs.evaluateAll((elements) =>
      elements.every((element) => {
        const bounds = element.getBoundingClientRect();
        return bounds.left >= 0 && bounds.right <= window.innerWidth;
      }),
    );

    expect(isEveryNodeVisible).toBe(true);
  });

  test("mantém a tabela navegável dentro do painel", async ({ page }) => {
    await openCaseStudy(page);

    const panel = page.getByRole("dialog", { name: "Caso Prático de Bom Negócio" });
    const tableWrap = panel.locator(".markdown-table-wrap");
    await page.waitForTimeout(700);
    const hasHorizontalOverflow = await tableWrap.evaluate(
      (element) => element.scrollWidth > element.clientWidth,
    );
    const panelFitsViewport = await panel.evaluate((element) => {
      const style = getComputedStyle(element);
      const left = Number.parseFloat(style.left);
      const right = Number.parseFloat(style.right);
      const width = Number.parseFloat(style.width);
      return left >= 0 && right >= 0 && width + left + right <= window.innerWidth;
    });

    expect(panelFitsViewport).toBe(true);
    expect(hasHorizontalOverflow).toBe(true);
  });
});
