import { useState } from 'react';

export default function PersonaList({ personas, activePersona, onSwitchPersona, onCreatePersona }) {
  const [newPersonaName, setNewPersonaName] = useState('');
  
  const handleCreatePersona = (e) => {
    e.preventDefault();
    if (newPersonaName.trim()) {
      onCreatePersona(newPersonaName.trim());
      setNewPersonaName('');
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400">Personas</h3>
      
      {/* List of personas */}
      <div className="space-y-2" role="listbox" aria-label="Personas">
        {personas && personas.length > 0 ? (
          personas.map((persona) => (
            <button
              type="button"
              key={persona.id}
              role="option"
              aria-selected={persona.id === activePersona}
              className={`w-full text-left p-2.5 rounded-lg transition flex items-center gap-3 border ${
                persona.id === activePersona
                  ? 'bg-neutral-900/60 border-white/30'
                  : 'bg-neutral-900 border-neutral-800 hover:bg-neutral-800'
              }`}
              onClick={() => onSwitchPersona(persona.id)}
            >
              <div className="w-8 h-8 rounded-full bg-white text-neutral-900 flex items-center justify-center font-semibold" aria-hidden>
                {persona.name?.charAt(0)?.toUpperCase() || '?'}
              </div>
              <span className="font-medium text-gray-100">{persona.name}</span>
              {persona.id === activePersona && (
                <span className="ml-auto chip">Active</span>
              )}
            </button>
          ))
        ) : (
          <div className="text-gray-500 text-center py-6 border border-dashed border-neutral-800 rounded-lg">No personas yet</div>
        )}
      </div>
      
      {/* Create new persona form */}
      <form onSubmit={handleCreatePersona} className="mt-4">
        <div className="flex gap-2">
          <label htmlFor="new-persona" className="sr-only">New persona name</label>
          <input
            id="new-persona"
            type="text"
            value={newPersonaName}
            onChange={(e) => setNewPersonaName(e.target.value)}
            placeholder="New persona name"
            className="input"
          />
          <button
            type="submit"
            className="btn btn-primary"
            aria-label="Create persona"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
}
