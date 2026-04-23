# Code Review

This review focuses on code cleanliness, best practices, consistency of the domain model, and the impact of separating `User`, `Owner`, and `Player`.

## Findings

### 1. High: Terrain ownership is modeled inconsistently

The database stores `terrains.owner_id` as a foreign key to `owners.id` in `database/migrations/2026_04_07_180126_create_terrains_table.php`, but the relation points to `User` in `app/Models/Terrain.php`.

At the same time, policies compare `terrain.owner_id` to `user.id` in `app/Policies/TerrainPolicy.php`.

That only works by accident if `owners.id === users.id`, which is not guaranteed.

Best practice:

- `Terrain::owner()` should belong to `Owner`, not `User`.
- Policies should compare against `$user->owner?->id`.
- All owner-based authorization should use the same model consistently.

### 2. High: Availability authorization calls do not match policy signatures

In `app/Http/Controllers/Api/V1/Owner/AvailabilityController.php`, the controller passes subjects to `authorize()` in a way that does not match `app/Policies/AvailabilityPolicy.php`.

Examples:

- `update()` calls `$this->authorize('update', [$terrain, $availability])`
- `delete()` calls `$this->authorize('delete', $terrain)`

But the policy methods expect `Availability` for `update` and `delete`.

This can cause wrong authorization behavior and confusing 403 responses.

Best practice:

- Make controller `authorize()` calls match policy method signatures exactly.
- Keep policy method arguments conventional and predictable.

### 3. Medium: ReservationResource exposes an owner that is never really loaded

In `app/Http/Resources/ReservationResource.php`, the resource uses:

- `new UserResource($this->whenLoaded('owner'))`

But `Reservation` does not have an `owner()` relation.

In the controller, you load `terrain.owner`, not `owner`.

Result:

- the `owner` field is misleading and may stay empty.

Best practice:

- Remove the `owner` field from `ReservationResource`, or
- derive it from `$this->terrain->owner` when `terrain.owner` is loaded.

### 4. Medium: Password reset error handling is too generic

In `app/Http/Controllers/Api/V1/AuthController.php`, failed reset currently throws:

- `throw new \Exception('Reset failed')`

For an API, this is too generic and usually becomes a 500 error instead of a clean business response.

Best practice:

- Return a proper JSON error response with status `400` or `422`.
- Include the Laravel reset status so the frontend can show a useful message.

### 5. Medium: UpdateAvailabilityRequest behaves more like PUT than PATCH

In `app/Http/Requests/Api/V1/Terrain/UpdateAvailabilityRequest.php`, both:

- `start_time`
- `end_time`

are required.

That is not ideal for a PATCH-style update endpoint.

Best practice:

- Use `sometimes` if you want partial updates.
- If both fields must always be sent, use `PUT` and document that clearly.

### 6. Medium: Test coverage is almost missing for real business logic

Current tests are only placeholders:

- `tests/Feature/ExampleTest.php`
- `tests/Unit/ExampleTest.php`

Important business areas currently have no protection:

- registration and profile creation
- owner authorization
- availability overlap
- reservation overlap
- payment flow and webhook behavior

Best practice:

- Add feature tests for the main user flows.
- Add overlap tests for availability and reservations.
- Add authorization tests for owner/player separation.

### 7. Low: There is leftover commented code and noise in several files

Examples:

- commented old code in `app/Models/Player.php`
- commented debug code in controllers and services
- unused imports in some request files

This is not a production bug, but it makes maintenance harder.

Best practice:

- Remove dead code once the final implementation is chosen.
- Keep files small and clean.

## About User / Owner / Player Separation

Your separation between:

- `User`
- `Owner`
- `Player`

is not wrong.

For your UML and your professor’s requirement, this is a valid implementation approach.

In practice, this means:

- `User` should stay the authenticatable account
- `Owner` should contain owner-specific profile/domain behavior
- `Player` should contain player-specific profile/domain behavior

The important thing is not the split itself.

The important thing is consistency after the split:

- relations must follow the same design
- foreign keys must reference the correct table
- policies must compare the correct IDs
- resources must expose the correct related models

## Recommended Priorities

### Priority 1

Fix the ownership inconsistency:

- `Terrain::owner()` relation
- owner-based policies
- any controller/service logic that assumes `owner_id` points to `users.id`

### Priority 2

Fix `AvailabilityPolicy` and `AvailabilityController` authorization mismatch.

### Priority 3

Clean `ReservationResource` so it only exposes relations that actually exist.

### Priority 4

Improve API error handling in password reset and similar flows.

### Priority 5

Add real tests for the important flows.

### Priority 6

Remove commented code, unused imports, and debug leftovers.

## Final Opinion

The project structure is not bad.

You already have:

- DTOs
- services
- repositories
- requests
- resources
- policies

That is a good base.

What you need now is not a full redesign.

What you need is:

- consistency
- cleanup
- stronger authorization correctness
- real tests

If you want the code to look clean and professional, the biggest win right now is fixing the owner/player/user consistency across the app.

## Payment Review For React Frontend

The current Stripe payment flow can work with a React frontend, but it still has a few important weaknesses.

### 1. High: Reservation is created before Stripe session is guaranteed

Right now the backend creates the reservation first, then creates the Stripe Checkout session.

If Stripe request fails after the reservation is stored, the frontend receives an error, but the reservation may still remain in the database with `pending_payment`.

Impact on React frontend:

- the user may see a failure message
- but the slot may already be blocked in the backend
- retrying can become confusing

Best practice:

- wrap reservation creation and Stripe initialization in a safer flow
- or mark failed session creation explicitly
- or delete/cancel the reservation when Stripe session creation fails

### 2. High: Frontend should not trust success page alone

Stripe redirecting the user to the success page does not guarantee that the backend already changed the reservation status.

The real source of truth is the webhook.

Impact on React frontend:

- user can land on `/payments/success`
- but reservation may still be `pending_payment` for a few seconds

Best practice:

- React success page should call backend and re-fetch the reservation status
- never mark payment as successful in frontend just because redirect happened
- rely on reservation `status` from API

### 3. Medium: No explicit cancel flow for frontend

If the user closes the Stripe page or clicks cancel, the reservation may stay `pending_payment` until Stripe sends `checkout.session.expired`.

Impact on React frontend:

- user may think payment is canceled immediately
- backend may still keep the reservation pending for some time

Best practice:

- add a cancel/expire strategy
- optionally expose an endpoint to cancel pending reservations manually
- or store an expiration timestamp and clean expired reservations

### 4. Medium: No payment expiration timestamp on reservation

The current implementation uses statuses only, but does not store when payment should expire.

Impact:

- pending reservations can be harder to clean
- debugging pending states becomes harder
- slot blocking can last too long if webhook is delayed or misconfigured

Best practice:

- add `payment_expires_at`
- ignore expired pending reservations in overlap logic
- run cleanup for abandoned pending payments

### 5. Medium: No idempotency protection for repeated frontend clicks

In React, users can click the reserve button twice or retry after a timeout.

Without idempotency or duplicate protection, this can create multiple pending reservations or multiple Stripe sessions.

Best practice:

- disable the reserve button while request is in progress
- consider backend protection for duplicate pending reservations for the same player/slot
- optionally use Stripe idempotency keys

### 6. Medium: Missing test coverage for payment and webhook flow

The payment flow is exactly the kind of logic that breaks silently if not tested.

Important scenarios still need tests:

- reservation becomes `pending_payment` after checkout creation
- webhook changes reservation to `confirmed`
- webhook changes reservation to `payment_failed`
- expired checkout changes reservation to `expired`
- overlap logic ignores failed/expired reservations when appropriate

### 7. Low: Small code cleanup in payment service

In `app/Services/StripeReservationPaymentService.php`, `DB` is imported but not used.

This is small, but removing this kind of noise keeps the payment code easier to read.

## Final Payment Opinion

For a first version, the current Stripe flow is acceptable for React if you use it carefully.

What is good:

- backend creates Checkout URL
- webhook is used as source of truth
- reservation has payment status

What still needs improvement before calling it solid:

- safer handling when Stripe session creation fails
- better expired/cancel handling
- frontend should poll or fetch reservation status after success redirect
- add tests for webhook-driven status changes

So the short answer is:

- yes, it can work with React
- no, it is not fully solid yet
- it needs a few improvements before I would call it production-safe
