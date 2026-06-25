# Legt eine Lizenz in der KV an (oder aktualisiert sie).
# Beispiel:
#   .\add-license.ps1 -Key "ASI-WERNER-7Q2F" -Id "werner.senn" -Name "Werner Senn" -ValidUntil "2027-06-30"
#   .\add-license.ps1 -Key "ASI-GAST-1234"  -Id "gast.demo"   -Name "Demo"        -ValidUntil "2026-09-30" -Features export,save
param(
  [Parameter(Mandatory=$true)][string]$Key,
  [Parameter(Mandatory=$true)][string]$Id,
  [Parameter(Mandatory=$true)][string]$Name,
  [string]$Tier = "standard",
  [string[]]$Features = @("export","save","share"),
  [Parameter(Mandatory=$true)][string]$ValidUntil,   # Format YYYY-MM-DD
  [ValidateSet("active","revoked")][string]$Status = "active"
)
$ErrorActionPreference = 'Stop'
$node = "$env:USERPROFILE\tools\node-v24.18.0-win-x64\node.exe"
$wr   = "$env:USERPROFILE\tools\node-v24.18.0-win-x64\wrangler.cmd"
$ns   = "6a82821eea0b419aaee67558fb1b1063"
$here = Split-Path -Parent $MyInvocation.MyCommand.Path

# Hash des rohen Schluessels (UTF-8) – identisch zur Worker-Berechnung
$hash = & $node -e "console.log(require('node:crypto').createHash('sha256').update(process.argv[1]).digest('hex'))" $Key

# Datensatz als JSON ohne BOM/Zeilenumbruch schreiben (sonst scheitert JSON.parse im Worker)
$rec = [ordered]@{ id=$Id; name=$Name; tier=$Tier; features=$Features; validUntil=$ValidUntil; status=$Status }
$json = $rec | ConvertTo-Json -Compress
$tmp = Join-Path $here "_record.tmp.json"
[System.IO.File]::WriteAllText($tmp, $json, (New-Object System.Text.UTF8Encoding($false)))

try {
  & $wr kv key put --namespace-id=$ns --remote "key:$hash" $Id
  & $wr kv key put --namespace-id=$ns --remote "lic:$Id" --path $tmp
} finally {
  Remove-Item $tmp -ErrorAction SilentlyContinue
}
Write-Host "OK: Lizenz '$Id' ($Name) – gueltig bis $ValidUntil – Status $Status – Features: $($Features -join ',')"
Write-Host "Schluessel (an Nutzer weitergeben): $Key"
