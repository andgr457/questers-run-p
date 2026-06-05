import { useState } from 'react'

type Props = {
  onCreated: (characterId: string) => void
}

export default function CharacterCreationScreen({ onCreated }: Props) {
  const [name, setName] = useState('')

  function handleCreate() {
    if (!name.trim()) return

    // later: call service/repository
    const newId = `char_${Date.now()}`

    onCreated(newId)
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Welcome, traveler</h1>

      <p>What is your name?</p>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter character name"
      />

      <button onClick={handleCreate}>
        Begin Journey
      </button>
    </div>
  )
}