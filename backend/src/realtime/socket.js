export function setupSocket(io, { db, socketsByUser }) {
  io.on('connection', (socket) => {
    socket.on('presence:join', (address) => {
      const key = address?.toLowerCase();
      if (!key) return;
      socketsByUser.set(key, socket.id);
      io.emit('presence:update', Array.from(socketsByUser.keys()));
    });

    socket.on('task:complete', async ({ address, taskId }) => {
      const user = db.data.users[address];
      const task = db.data.tasks.find((item) => item.id === taskId);
      if (!user || !task) return;

      user.reputation += task.points;
      db.data.activityFeed.unshift({ type: 'task', user: address, taskId, timestamp: Date.now() });
      await db.write();
      io.emit('activity', { type: 'taskCompleted', user: address, taskId });
    });

    socket.on('disconnect', () => {
      for (const [address, id] of socketsByUser.entries()) {
        if (id === socket.id) socketsByUser.delete(address);
      }
      io.emit('presence:update', Array.from(socketsByUser.keys()));
    });
  });
}
