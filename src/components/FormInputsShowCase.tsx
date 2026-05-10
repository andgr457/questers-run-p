export default function FormInputsShowcase() {
  return (
    <div className="p-6 space-y-6 max-w-xl text-white">
      <h1 className="text-xl font-bold">Form Inputs Showcase</h1>

      {/* TEXT */}
      <div className="input-group">
        <label className="form-label">Text Input</label>
        <input type="text" placeholder="Enter text..." />
      </div>

      {/* SEARCH */}
      <div className="input-group">
        <label className="form-label">Search Input</label>
        <input type="search" placeholder="Search..." />
      </div>

      {/* EMAIL */}
      <div className="input-group">
        <label className="form-label">Email Input</label>
        <input type="email" placeholder="you@example.com" />
      </div>

      {/* PASSWORD */}
      <div className="input-group">
        <label className="form-label">Password Input</label>
        <input type="password" placeholder="••••••••" />
      </div>

      {/* NUMBER */}
      <div className="input-group">
        <label className="form-label">Number Input</label>
        <input type="number" placeholder="0" />
      </div>

      {/* TEXTAREA */}
      <div className="input-group">
        <label className="form-label">Textarea</label>
        <textarea placeholder="Write something..." />
      </div>

      {/* SELECT */}
      <div className="input-group">
        <label className="form-label">Select Dropdown</label>
        <select>
          <option value="">Choose an option</option>
          <option value="warrior">Warrior</option>
          <option value="mage">Mage</option>
          <option value="rogue">Rogue</option>
        </select>
      </div>

      {/* DISABLED */}
      <div className="input-group">
        <label className="form-label">Disabled Input</label>
        <input type="text" disabled value="Locked" />
      </div>
    </div>
  );
}
