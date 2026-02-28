import { Link } from 'react-router-dom';

export function Header({ token, address, onConnect }) {
  return (
    <header>
      <h1>ATLAS VALLEY ECOSYSTEM</h1>
      <nav>
        <Link to="/">Dashboard</Link>
        <Link to="/avatar">Avatar</Link>
        <Link to="/biometrics">Vitals</Link>
      </nav>
      {!token ? <button onClick={onConnect}>Connect MetaMask</button> : <span>{address}</span>}
    </header>
  );
}
