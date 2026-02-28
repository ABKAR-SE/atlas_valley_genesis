import { useState } from 'react';

export function BiometricsPage({ onSubmit }) {
  const [heartRate, setHeartRate] = useState(72);
  const [activityLevel, setActivityLevel] = useState(3);
  const [sleepHours, setSleepHours] = useState(7);
  const [healthScore, setHealthScore] = useState(80);

  return (
    <main>
      <h2>Secure Vitals Link</h2>
      <form onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ heartRate, activityLevel, sleepHours, healthScore });
      }}>
        <label>Heart rate<input type="number" value={heartRate} onChange={(e) => setHeartRate(Number(e.target.value))} /></label>
        <label>Activity level<input type="number" value={activityLevel} onChange={(e) => setActivityLevel(Number(e.target.value))} /></label>
        <label>Sleep hours<input type="number" value={sleepHours} onChange={(e) => setSleepHours(Number(e.target.value))} /></label>
        <label>Health score<input type="number" value={healthScore} onChange={(e) => setHealthScore(Number(e.target.value))} /></label>
        <button type="submit">Encrypt + Store Proof + Mine ARKV</button>
      </form>
    </main>
  );
}
