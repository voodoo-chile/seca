Feature: Creating a Role
  As a SECA user
  I want to be able to create multiple roles
  So that I can sandbox my communications

  Scenario: creating a user on first startup
    Given I have a javascript-enabled browser
    When I connect to the SECA server for the first time
    Then I am prompted to create a new user
      And I cannot continue without creating a user  

  Scenario: creating a role for a new user
    Given I have created a user
    When I login using that user for the first time
    Then I am prompted to create a role for that user
      And I cannot continue without creating a role

  Scenario: adding a role
    Given I have an existing role
    When I choose "create a new role"
    Then I am prompted to create a new role

  Scenario: saving the new role
    Given I have entered a name for a new role
    When I click submit
    Then a keypair is automatically generated for that role
      And the role in use is switched to that role