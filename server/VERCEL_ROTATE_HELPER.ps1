# VERCEL_ROTATE_HELPER.ps1
# Interactive helper: prompts for new secret values and prints ready-to-run
# Vercel CLI commands. This script DOES NOT execute `vercel` itself — copy/paste
# the printed commands to your terminal where `vercel` is installed and you're logged in.

function Read-Plain([string]$prompt) {
  $s = Read-Host -Prompt $prompt -AsSecureString
  $ptr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($s)
  try { [Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr) } finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr) }
}

Write-Host "This helper will produce `vercel env add` commands for production and preview environments.`nDo NOT commit secrets to git.`n" -ForegroundColor Yellow

$ADMIN_SECRET = Read-Plain "ADMIN_SECRET"
$RESEND_API_KEY = Read-Plain "RESEND_API_KEY"
$SESSION_SECRET = Read-Plain "SESSION_SECRET"
$MONGODB_USER = Read-Plain "MONGODB_USER"
$MONGODB_PASSWORD = Read-Plain "MONGODB_PASSWORD"
$MONGODB_URI = Read-Plain "(optional) Full MONGODB_URI (leave empty to set MONGODB_USER/PASSWORD instead)"

Write-Host "`n=== Ready-to-run commands ===`n" -ForegroundColor Green
Write-Host "# If your `vercel` CLI supports --value you can run these non-interactively:" -ForegroundColor Cyan
if ($MONGODB_URI -ne '') {
  Write-Host "vercel env add MONGODB_URI production --value '$MONGODB_URI'"
  Write-Host "vercel env add MONGODB_URI preview --value '$MONGODB_URI'"
} else {
  Write-Host "vercel env add MONGODB_USER production --value '$MONGODB_USER'"
  Write-Host "vercel env add MONGODB_USER preview --value '$MONGODB_USER'"
  Write-Host "vercel env add MONGODB_PASSWORD production --value '$MONGODB_PASSWORD'"
  Write-Host "vercel env add MONGODB_PASSWORD preview --value '$MONGODB_PASSWORD'"
}
Write-Host "vercel env add ADMIN_SECRET production --value '$ADMIN_SECRET'"
Write-Host "vercel env add ADMIN_SECRET preview --value '$ADMIN_SECRET'"
Write-Host "vercel env add RESEND_API_KEY production --value '$RESEND_API_KEY'"
Write-Host "vercel env add RESEND_API_KEY preview --value '$RESEND_API_KEY'"
Write-Host "vercel env add SESSION_SECRET production --value '$SESSION_SECRET'"
Write-Host "vercel env add SESSION_SECRET preview --value '$SESSION_SECRET'"

Write-Host "`n# If --value is not supported by your vercel CLI, run the same commands WITHOUT --value and paste the value when prompted:`n" -ForegroundColor Cyan
if ($MONGODB_URI -ne '') {
  Write-Host "vercel env add MONGODB_URI production"
  Write-Host "vercel env add MONGODB_URI preview"
} else {
  Write-Host "vercel env add MONGODB_USER production"
  Write-Host "vercel env add MONGODB_USER preview"
  Write-Host "vercel env add MONGODB_PASSWORD production"
  Write-Host "vercel env add MONGODB_PASSWORD preview"
}
Write-Host "vercel env add ADMIN_SECRET production"
Write-Host "vercel env add ADMIN_SECRET preview"
Write-Host "vercel env add RESEND_API_KEY production"
Write-Host "vercel env add RESEND_API_KEY preview"
Write-Host "vercel env add SESSION_SECRET production"
Write-Host "vercel env add SESSION_SECRET preview"

Write-Host "`nAfter adding env vars, trigger a production deploy (push to main or run: vercel --prod)." -ForegroundColor Yellow
Write-Host "Then verify endpoints: /api/health, /api/admin/auth-audit (with X-Admin-Secret), /api/auth/magic and /api/receipts/<orderRef> (with Authorization)." -ForegroundColor Yellow
