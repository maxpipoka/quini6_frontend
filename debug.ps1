$c = irm 'http://localhost:4323/'
$l = $c -split "`n"
for($i=4880; $i -le 4895; $i++) {
    if($i -lt $l.Count) {
        Write-Host $i ':' $l[$i]
    }
}