function startBreathing(duration = 4, barId) {
  const container = document.getElementById(barId);
  if (!container) return;

  container.innerHTML = "";

  var bar = new ProgressBar.Line(container, {
    strokeWidth: 6,
    color: "#6c63ff",
    trailColor: "#e2e8f0",
    trailWidth: 6,
    duration: duration * 1000,
    easing: "linear",
    svgStyle: { 
      width: "100%", 
      height: "100%",
      borderRadius: "10px" 
    }
  });

  bar.set(1);       // start full
  bar.animate(0);   // drain to 0 over duration
}