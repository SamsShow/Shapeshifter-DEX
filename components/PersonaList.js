import { useState } from 'react';

export default function PersonaList({ personas, activePersona, onSwitchPersona, onCreatePersona }) {
  const [newPersonaName, setNewPersonaName] = useState('');
  
  const handleCreatePersona = (e) => {
    e.preventDefault();
    if (newPersonaName.trim()) {
      onCreatePersona(newPersonaName);
      setNewPersonaName('');
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Your Personas</h3>
      
      {/* List of personas */}
      <div className="space-y-2">
        {personas && personas.length > 0 ? (
          personas.map((persona) => (
            <div 
              key={persona.id}
              className={`p-3 rounded-lg cursor-pointer transition flex items-center space-x-3 ${
                persona.id === activePersona ? 'bg-primary-100 border border-primary-300' : 'bg-gray-100 hover:bg-gray-200'
              }`}
              onClick={() => onSwitchPersona(persona.id)}
            >
              <div className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center">
                {persona.name.charAt(0).toUpperCase()}
              </div>
              <span className="font-medium">{persona.name}</span>
              {persona.id === activePersona && (
                <span className="ml-auto text-xs px-2 py-1 bg-primary-500 text-white rounded-full">
                  Active
                </span>
              )}
            </div>
          ))
        ) : (
          <div className="text-gray-500 text-center py-4">No personas yet</div>
        )}
      </div>
      
      {/* Create new persona form */}
      <form onSubmit={handleCreatePersona} className="mt-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newPersonaName}
            onChange={(e) => setNewPersonaName(e.target.value)}
            placeholder="New persona name"
            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
}
