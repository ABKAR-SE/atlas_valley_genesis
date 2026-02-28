export function DashboardPage({ ecosystem, walletStats, online, completeTask }) {
  return (
    <main className="grid">
      <section>
        <h2>Wallet & Rewards</h2>
        <p>ARKV Balance: {walletStats.balance}</p>
        <p>Total On-chain Rewards: {walletStats.totalRewards}</p>
      </section>
      <section>
        <h2>Presence</h2>
        <ul>
          {ecosystem.users.map((u) => (
            <li key={u.address}>
              {u.avatar} • Rep {u.reputation} • {online.includes(u.address.toLowerCase()) ? '🟢 Online' : '⚫ Offline'}
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2>Collaborative Missions</h2>
        <ul>
          {ecosystem.tasks.map((task) => (
            <li key={task.id}>
              {task.title} (+{task.points}) <button onClick={() => completeTask(task.id)}>Complete</button>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2>Live Activity Feed</h2>
        <ul>{ecosystem.feed.map((f, i) => <li key={i}>{f.type} by {f.user}</li>)}</ul>
      </section>
    </main>
  );
}
