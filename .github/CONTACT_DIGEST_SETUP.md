# Weekly contact digest setup

The `Weekly contact digest` workflow runs every Monday at 08:00 East Africa Time and can also be started manually from the GitHub Actions tab.

Add these repository secrets under **Settings → Secrets and variables → Actions** before enabling the workflow:

| Secret                      | Value                                                                                             |
| --------------------------- | ------------------------------------------------------------------------------------------------- |
| `SUPABASE_URL`              | The project URL for the Supabase project that stores `contact_messages`.                          |
| `SUPABASE_SERVICE_ROLE_KEY` | The Supabase service-role key. Keep this secret and never expose it in frontend code.             |
| `RESEND_API_KEY`            | A Resend API key with permission to send email.                                                   |
| `CONTACT_DIGEST_FROM_EMAIL` | A verified Resend sender, for example `Elite Stainless <notifications@your-verified-domain.com>`. |
| `CONTACT_DIGEST_TO_EMAIL`   | The inbox that should receive the weekly digest, such as `elitestainlesssteelconcepts@gmail.com`. |

The workflow reads contact submissions from the previous seven days and sends one digest email. It does not expose service credentials to the browser. The source website can be tested immediately with **Actions → Weekly contact digest → Run workflow** after the secrets are added.
