document.getElementById('btn').addEventListener('click', async ()=>{
  console.log(1);
  
  const url = document.getElementById('url').value.trim();
  if (url != "") {
    try {
      const res = await fetch('/api/add-address', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: url })
      });
      const data = await res.json();
      if (data.status == 'success') {
        document.getElementById('result').innerHTML = `
        <a target="#blank" href="${window.location.href}${data.shortAddress}">${window.location.href}${data.shortAddress}</a>
        <a class="btn" target="#blank" href="${window.location.href}${data.shortAddress}">باز کردن لینک</a>
        `
      } else {
        document.getElementById('result').innerHTML = "خطای نامشخص";
      }
    } catch (error) {
      console.error(error);
      document.getElementById('result').innerHTML = `خطا: ${error}`;
    }
  }
});