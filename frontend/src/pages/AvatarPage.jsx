import { useState } from 'react';

export function AvatarPage({ profile, onSave }) {
  const [name, setName] = useState(profile?.profile?.name || '');
  const [bio, setBio] = useState(profile?.profile?.bio || '');
  const [attributes, setAttributes] = useState(profile?.profile?.attributes || 'Explorer,Builder');

  return (
    <main>
      <h2>Avatar Identity</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave({
            name,
            bio,
            attributes: attributes.split(',').map((item) => item.trim())
          });
        }}
      >
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Avatar Name" required />
        <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Bio" required />
        <input value={attributes} onChange={(e) => setAttributes(e.target.value)} placeholder="attributes comma separated" />
        <button type="submit">Save to IPFS + chain hash</button>
      </form>
      {profile?.profile?.cid && <p>Current CID: {profile.profile.cid}</p>}
    </main>
  );
}
