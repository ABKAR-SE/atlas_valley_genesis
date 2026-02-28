import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { io } from 'socket.io-client';
import { Header } from './components/Header';
import { DashboardPage } from './pages/DashboardPage';
import { AvatarPage } from './pages/AvatarPage';
import { BiometricsPage } from './pages/BiometricsPage';
import { API_URL, api } from './lib/api';

const socket = io(API_URL, { autoConnect: false });

export function App() {
  const [address, setAddress] = useState('');
  const [token, setToken] = useState(localStorage.getItem('atlasToken') || '');
  const [profile, setProfile] = useState(null);
  const [ecosystem, setEcosystem] = useState({ users: [], tasks: [], feed: [], rewards: {} });
  const [walletStats, setWalletStats] = useState({ balance: '0', totalRewards: '0' });
  const [online, setOnline] = useState([]);

  useEffect(() => {
    if (token) load();
  }, [token]);

  useEffect(() => {
    if (!token || !address) return;

    socket.connect();
    socket.emit('presence:join', address);
    socket.on('activity', load);
    socket.on('presence:update', setOnline);

    return () => {
      socket.off('activity', load);
      socket.off('presence:update', setOnline);
      socket.disconnect();
    };
  }, [token, address]);

  async function connectWallet() {
    if (!window.ethereum) throw new Error('MetaMask is required');

    const [selected] = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAddress(selected);

    const nonceResp = await api('/auth/nonce', 'POST', { address: selected });
    const signature = await window.ethereum.request({
      method: 'personal_sign',
      params: [nonceResp.message, selected]
    });

    const verify = await api('/auth/verify', 'POST', { address: selected, signature });
    localStorage.setItem('atlasToken', verify.token);
    setToken(verify.token);
  }

  async function load() {
    if (!token) return;
    setProfile(await api('/profile', 'GET', null, token));
    setEcosystem(await api('/ecosystem', 'GET', null, token));
    if (address) setWalletStats(await api(`/wallet/${address}`));
  }

  async function saveAvatar(formData) {
    await api('/avatar', 'POST', formData, token);
    await load();
  }

  async function submitBiometrics(data) {
    await api('/biometrics', 'POST', data, token);
    await load();
  }

  const completeTask = (taskId) => socket.emit('task:complete', { address, taskId });

  return (
    <div className="app">
      <Header token={token} address={address} onConnect={connectWallet} />

      <Routes>
        <Route
          path="/"
          element={token ? <DashboardPage ecosystem={ecosystem} walletStats={walletStats} online={online} completeTask={completeTask} /> : <p>Connect wallet to access your persistent ecosystem identity.</p>}
        />
        <Route path="/avatar" element={token ? <AvatarPage profile={profile} onSave={saveAvatar} /> : <Navigate to="/" />} />
        <Route path="/biometrics" element={token ? <BiometricsPage onSubmit={submitBiometrics} /> : <Navigate to="/" />} />
      </Routes>
    </div>
  );
}
