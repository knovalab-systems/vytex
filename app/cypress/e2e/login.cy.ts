// login.cy
/// <reference types="cypress" />

describe('Login test', () => {
	before(() => {
		cy.visit('/login');
	});

	it('username-password-cv', () => {
		cy.get('#username-field').type('admin');
		cy.get('#pass-field').type('password123');
		cy.get('.inline-flex').click();

		// home should be in the page
		cy.get('.text-4xl').should('contain', 'Home');
	});

	// username

	it('username-ci-empty', () => {
		cy.get('#pass-field').type('password123');
		cy.get('.inline-flex').click();

		cy.get('.text-red-600').should('have.text', 'Ingresa el usuario.');
	});

	it('username-ci-dont-exits', () => {
		cy.get('#username-field').type('nouser');
		cy.get('#pass-field').type('password123');
		cy.get('.inline-flex').click();

		cy.get('[role="status"]').should('have.text', 'Revisa tu usuario y contraseña');
	});

	// password

	it('password-ci-empty', () => {
		cy.get('#username-field').clear();
		cy.get('#username-field').type('admin');
		cy.get('#pass-field').clear();
		cy.get('.inline-flex').click();
		cy.get('.text-red-600').should('have.text', 'Ingresa la contraseña.');
	});

	it('password-ci-bad-password', () => {
		cy.get('#username-field').clear();
		cy.get('#username-field').type('admin');
		cy.get('#pass-field').clear();
		cy.get('#pass-field').type('123456789');
		cy.get('.inline-flex').click();
		cy.get('[role="status"]').should('have.text', 'Revisa tu usuario y contraseña');
	});
});
