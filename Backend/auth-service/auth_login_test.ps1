$tests = @(
    [pscustomobject]@{ Name = 'Valid'; Body = '{"identifier":"admin@tenalink.com","password":"admin123"}' }
    [pscustomobject]@{ Name = 'Missing'; Body = '{"identifier":"missing@tenalink.com","password":"x"}' }
    [pscustomobject]@{ Name = 'Wrong'; Body = '{"identifier":"admin@tenalink.com","password":"wrongpass"}' }
)

foreach ($test in $tests) {
    Write-Host "=== $($test.Name) ==="
    try {
        $res = Invoke-RestMethod -Uri 'http://localhost:8085/api/v1/auth/login' -Method Post -Body $test.Body -ContentType 'application/json'
        Write-Host 'STATUS: 200'
        $res | ConvertTo-Json -Compress
    } catch {
        Write-Host "ERROR: $($_.Exception.Message)"
        if ($_.Exception.Response) {
            $resp = $_.Exception.Response
            Write-Host "STATUS: $($resp.StatusCode.value__)"
            $reader = [System.IO.StreamReader]::new($resp.GetResponseStream())
            Write-Host $reader.ReadToEnd()
            $reader.Close()
        }
    }
    Write-Host ''
}
