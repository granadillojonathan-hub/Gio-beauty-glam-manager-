const stripe = Stripe(process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_51O4b5aBPUC8fGq4R7Z7tH3cJ2r7d5o9Q4w0v7u6p8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2'); // Reemplaza con tu pk_test_... real

function checkout() {
  fetch('/create-checkout-session', { method: 'POST' })
    .then(res => res.json())
    .then(data => {
      stripe.redirectToCheckout({ sessionId: data.id });
    })
    .catch(err => alert('Error: ' + err));
}

function saveNotes() {
  localStorage.setItem('notes', document.getElementById('notes').value);
  alert('Notas guardadas');
}
// Carga notas al cargar página
window.addEventListener('load', () => {
  document.getElementById('notes').value = localStorage.getItem('notes') || '';
});

function optimizeBio() {
  const bio = document.getElementById('bio-input').value;
  fetch('/optimize-bio', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ currentBio: bio })
  }).then(res => res.json()).then(data => {
    if (data.error) alert('Error: ' + data.error);
    document.getElementById('optimized-bio').textContent = data.optimized;
  }).catch(err => alert('Error: ' + err));
}

function generateContent() {
  fetch('/generate-content', { method: 'POST' })
    .then(res => res.json()).then(data => {
      if (data.error) alert('Error: ' + data.error);
      document.getElementById('content-idea').textContent = data.idea;
    }).catch(err => alert('Error: ' + err));
}

function generateCampaign() {
  fetch('/generate-campaign', { method: 'POST' })
    .then(res => res.json()).then(data => {
      if (data.error) alert('Error: ' + data.error);
      document.getElementById('campaign-text').textContent = data.campaign;
    }).catch(err => alert('Error: ' + err));
}

function startExtendia() {
  document.getElementById('hair-photo').click();
  document.getElementById('hair-photo').onchange = (e) => {
    const formData = new FormData();
    formData.append('photo', e.target.files[0]);
    fetch('/analyze-hair', { method: 'POST', body: formData })
      .then(res => res.json()).then(data => {
        if (data.error) alert('Error: ' + data.error);
        document.getElementById('analysis-result').textContent = data.analysis;
        const canvas = document.getElementById('try-on-canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.src = URL.createObjectURL(e.target.files[0]);
        img.onload = () => {
          ctx.drawImage(img, 0, 0, 300, 400);
          updateTryOn(); // Inicial
        };
        fetch('/recommend', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ analysis: data.analysis })
        }).then(res => res.json()).then(rec => {
          if (rec.error) alert('Error: ' + rec.error);
          document.getElementById('recommendation').textContent = rec.recommendation;
        });
      }).catch(err => alert('Error: ' + err));
  };
}

function updateTryOn() {
  const canvas = document.getElementById('try-on-canvas');
  const ctx = canvas.getContext('2d');
  // Asume base ya dibujada, superpone nueva ext
  const extImg = new Image();
  extImg.src = document.getElementById('ext-type').value;
  extImg.onload = () => ctx.drawImage(extImg, 50, 100, 200, 200);
}

document.getElementById('ext-type').addEventListener('change', updateTryOn);

function subscribe() {
  const email = document.getElementById('email-sub').value;
  fetch('/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  }).then(res => res.json()).then(data => {
    if (data.error) alert('Error: ' + data.error);
    alert(data.message);
  }).catch(err => alert('Error: ' + err));
}
