describe("Login Authentication", () => {
    it('should login to the dashboard', function () {
        cy.visit('http://localhost:8080')
        cy.get("#normal_login_email").should("exist").type("ajaomahmud@gmail.com")
        cy.get("#normal_login_password").should("exist").type("12345678890")
        cy.get("#submitButton").click()
        cy.contains("Dashboard")
    });

    it('should display the dashboard', function () {
        cy.contains("Dashboard")
    });
})