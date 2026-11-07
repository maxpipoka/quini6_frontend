# Delta for admin-layout

## ADDED Requirements

### Requirement: Health Check Navigation Item

The system SHALL add a "Salud del sistema" navigation item to the admin sidebar linking to `/admin/health`.

#### Scenario: Sidebar displays health check link

- GIVEN authenticated admin views any admin page
- WHEN Sidebar component renders
- THEN navigation list includes "Salud del sistema" item
- AND item links to `/admin/health`
- AND item displays with appropriate icon (e.g., heart-pulse, activity, or database)

#### Scenario: Health check link highlights when active

- GIVEN admin navigates to `/admin/health`
- WHEN Sidebar renders
- THEN "Salud del sistema" item receives active styling
- AND visual indication shows current page

#### Scenario: Health check link only shows for authenticated admins

- GIVEN user is not authenticated
- WHEN Sidebar renders (on login page or after redirect)
- THEN "Salud del sistema" item does not display
- AND only login-relevant navigation shows

#### Scenario: Health check link respects admin permissions (future)

- GIVEN authenticated user without admin health permissions
- WHEN Sidebar renders
- THEN "Salud del sistema" item does not display
- AND no access to `/admin/health` route