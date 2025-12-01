import React, { useState, useEffect, useRef } from 'react';
import {
  Search, X, ArrowLeft, Users, BookOpen, Crown, Heart,
  ChevronRight, ChevronDown, Home, Sparkles
} from 'lucide-react';

const BiblicalBloodlines = ({ onClose }) => {
  const baseUrl = process.env.PUBLIC_URL || '';
  const [allPeople, setAllPeople] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const [jesusLineage, setJesusLineage] = useState(new Set());
  const [currentTree, setCurrentTree] = useState(null);
  const [availableTrees, setAvailableTrees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const treeRef = useRef(null);

  // Available family trees
  const treeDefinitions = [
    {
      id: 'jesus',
      path: `${baseUrl}/biblical_lineages_json/nt/jesus_genealogy.json`,
      name: 'Jesus Genealogy',
      icon: '✝️',
      connections: 'Links upstream to Shem lineage'
    },
    {
      id: 'israel',
      path: `${baseUrl}/biblical_lineages_json/israel/israel.json`,
      name: '12 Tribes of Israel',
      icon: '🕎'
    },
    {
      id: 'shem',
      path: `${baseUrl}/biblical_lineages_json/shem/shem_abrahamic_and_aram.json`,
      name: 'Shem to Abraham',
      icon: '📜',
      connections: 'Reachable from Jesus genealogy'
    },
    { id: 'ham', path: `${baseUrl}/biblical_lineages_json/ham/ham.json`, name: 'Ham & Descendants', icon: '🌍' },
    { id: 'japheth', path: `${baseUrl}/biblical_lineages_json/japheth/japheth.json`, name: 'Japheth & Descendants', icon: '🌏' },
    { id: 'esau', path: `${baseUrl}/biblical_lineages_json/esau_edom/esau_edom.json`, name: 'Esau/Edom', icon: '⛰️' },
    {
      id: 'ishmael',
      path: `${baseUrl}/biblical_lineages_json/ishmael/ishmael_line.json`,
      name: 'Ishmael & Ishmaelites',
      icon: '🏜️',
      connections: 'Backlinks to Abraham and Shem'
    },
    { id: 'moab', path: `${baseUrl}/biblical_lineages_json/moab_ammon/moab_ammon.json`, name: 'Moab & Ammon', icon: '🏛️' },
    { id: 'canaan', path: `${baseUrl}/biblical_lineages_json/canaan/canaan.json`, name: 'Canaan & Canaanites', icon: '🏺' },
    { id: 'keturah', path: `${baseUrl}/biblical_lineages_json/keturah_midian/keturah_midian.json`, name: 'Keturah & Midian', icon: '🐪' },
    { id: 'arameans', path: `${baseUrl}/biblical_lineages_json/arameans/aram_arameans.json`, name: 'Arameans', icon: '🏔️' }
  ];

  // Load tree data
  useEffect(() => {
    loadAvailableTrees();
  }, []);

  const fetchJsonStrict = async (path) => {
    const res = await fetch(path, { cache: 'no-cache' });
    if (!res.ok) {
      throw new Error(`Failed to load ${path} (${res.status})`);
    }
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch (_) {
      throw new Error(`Invalid JSON returned from ${path}`);
    }
  };

  const loadAvailableTrees = async () => {
    setLoading(true);
    setLoadError(null);
    const trees = [];

    for (const treeDef of treeDefinitions) {
      try {
        await fetchJsonStrict(treeDef.path);
        trees.push(treeDef);
      } catch (error) {
        console.log(`Could not load ${treeDef.name}:`, error);
      }
    }

    setAvailableTrees(trees);
    setLoading(false);
  };

  const loadTree = async (treeDef) => {
    try {
      const data = await fetchJsonStrict(treeDef.path);

      const shemData =
        treeDef.id === 'jesus' || treeDef.id === 'ishmael'
          ? await fetchJsonStrict(`${baseUrl}/biblical_lineages_json/shem/shem_abrahamic_and_aram.json`)
          : null;

      const stitchToShem = (node, chain) => {
        let current = node;
        chain.forEach(name => {
          if (!current.children) current.children = [];
          let next = current.children.find(c => c.name === name);
          if (!next) {
            next = { name, type: 'person', children: [] };
            current.children.push(next);
          }
          current = next;
        });
        if (shemData && !current.children.some(c => c.name === 'Shem')) {
          const cloneDeep = (obj) => JSON.parse(JSON.stringify(obj));
          current.children.push(cloneDeep(shemData));
        }
      };

      // If loading Jesus, stitch upstream ancestors so we can navigate back to Shem
      if (treeDef.id === 'jesus') {
        const ancestryChain = [
          'Jesse',
          'Obed',
          'Boaz',
          'Salmon',
          'Nahshon',
          'Amminadab',
          'Ram',
          'Hezron',
          'Perez',
          'Judah',
          'Jacob',
          'Isaac',
          'Abraham'
        ];
        const attachAncestry = (node) => {
          let current = node;
          ancestryChain.forEach(name => {
            if (!current.children) current.children = [];
            let next = current.children.find(c => c.name === name);
            if (!next) {
              next = { name, type: 'person', children: [] };
              current.children.push(next);
            }
            current = next;
          });
          // Attach Shem lineage (deep copy) if not already attached
          if (!current.children.some(c => c.name === 'Shem')) {
            const cloneDeep = (obj) => JSON.parse(JSON.stringify(obj));
            current.children.push(cloneDeep(shemData));
          }
        };
        // Attach to every David node we find (both Joseph and Mary lines)
        const walkAndAttach = (node) => {
          if (!node) return;
          if (node.name === 'David') {
            attachAncestry(node);
          }
          ['children', 'legal_line_through_joseph', 'line_through_mary'].forEach(key => {
            const child = node[key];
            if (Array.isArray(child)) {
              child.forEach(walkAndAttach);
            } else if (child && typeof child === 'object') {
              walkAndAttach(child);
            }
          });
        };
        walkAndAttach(data);
      } else if (treeDef.id === 'ishmael' && shemData) {
        // Stitch Ishmael back to Shem via Abraham
        stitchToShem(data, ['Abraham']);
      }

      setCurrentTree({ ...treeDef, data });

      // Extract all people for search
      const people = extractPeople(data);
      setAllPeople(people);

      // If this is Jesus's genealogy, mark the lineage
      if (treeDef.id === 'jesus') {
        const lineage = extractJesusLineage(data);
        setJesusLineage(lineage);
        // Auto-expand Jesus's line
        setExpandedNodes(lineage);
      } else {
        setJesusLineage(new Set());
        setExpandedNodes(new Set());
      }
    } catch (error) {
      console.error('Error loading tree:', error);
      setLoadError(error.message);
      setCurrentTree(null);
    }
  };

  const extractPeople = (node, path = [], results = []) => {
    if (!node) return results;

    if (node.name) {
      const akaNames = node.aka || [];
      const roleTags = [];
      if (node.type === 'patriarch' || node.type === 'matriarch') roleTags.push('patriarch');
      if (node.type === 'spouse') roleTags.push('spouse');
      results.push({
        ...node,
        path: [...path, node.name],
        fullPath: path.join(' → '),
        searchable: [
          node.name,
          ...akaNames,
          ...(node.spouse ? [node.spouse] : []),
          ...(node.wives ? node.wives : []),
          ...roleTags
        ].filter(Boolean).map(s => s.toLowerCase())
      });
    }

    // Handle special Jesus genealogy structure
    if (node.legal_line_through_joseph) {
      extractPeople(node.legal_line_through_joseph, [...path, node.name, 'Joseph (legal)'], results);
    }
    if (node.line_through_mary) {
      extractPeople(node.line_through_mary, [...path, node.name, 'Mary (biological)'], results);
    }

    if (node.children && Array.isArray(node.children)) {
      node.children.forEach(child => {
        extractPeople(child, [...path, node.name], results);
      });
    }

    return results;
  };

  const extractJesusLineage = (node, lineage = new Set()) => {
    if (!node) return lineage;

    // Add Jesus and his ancestors
    lineage.add(node.name);

    // Follow both Joseph and Mary's lines
    if (node.legal_line_through_joseph) {
      extractJesusLineageRecursive(node.legal_line_through_joseph, lineage);
    }
    if (node.line_through_mary) {
      extractJesusLineageRecursive(node.line_through_mary, lineage);
    }

    return lineage;
  };

  const extractJesusLineageRecursive = (node, lineage) => {
    if (!node) return;

    lineage.add(node.name);

    if (node.children && Array.isArray(node.children)) {
      node.children.forEach(child => {
        extractJesusLineageRecursive(child, lineage);
      });
    }
  };

  const toggleNode = (nodeName) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeName)) {
        newSet.delete(nodeName);
      } else {
        newSet.add(nodeName);
      }
      return newSet;
    });
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term.length > 0) {
      const results = allPeople.filter(person =>
        person.name.toLowerCase().includes(term.toLowerCase()) ||
        (person.aka && person.aka.some(name => name.toLowerCase().includes(term.toLowerCase())))
      );

      if (results.length > 0) {
        setSelectedPerson(results[0]);
      }
    }
  };

  const renderNode = (node, level = 0, parentPath = []) => {
    if (!node) return null;

    const nodePath = [...parentPath, node.name].join('→');
    const isExpanded = expandedNodes.has(nodePath);
    const isInJesusLine = jesusLineage.has(node.name);
    const hasChildren = (node.children && node.children.length > 0) ||
                       node.legal_line_through_joseph ||
                       node.line_through_mary;

    return (
      <div key={nodePath} className="ml-4">
        <div
          className={`group flex items-center gap-2 py-2 px-3 rounded-lg cursor-pointer transition-all ${
            selectedPerson?.name === node.name
              ? 'bg-purple-600 text-white'
              : isInJesusLine
              ? 'bg-amber-500/20 border-2 border-amber-500 hover:bg-amber-500/30'
              : 'hover:bg-slate-700'
          }`}
          onClick={() => {
            setSelectedPerson(node);
            if (hasChildren) {
              toggleNode(nodePath);
            }
          }}
        >
          {hasChildren && (
            <button
              className="flex-shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                toggleNode(nodePath);
              }}
            >
              {isExpanded ? (
                <ChevronDown size={16} className={isInJesusLine ? 'text-amber-400' : 'text-purple-400'} />
              ) : (
                <ChevronRight size={16} className={isInJesusLine ? 'text-amber-400' : 'text-purple-400'} />
              )}
            </button>
          )}

          {!hasChildren && <div className="w-4" />}

          <div className="flex items-center gap-2 flex-1">
            {isInJesusLine && <Sparkles size={14} className="text-amber-400" />}

            <span className={`font-semibold ${isInJesusLine ? 'text-amber-100' : 'text-white'}`}>
              {node.name}
            </span>

            {node.aka && node.aka.length > 0 && (
              <span className="text-xs text-purple-300">
                (aka {node.aka.join(', ')})
              </span>
            )}

            {node.type && (
              <span className={`text-xs px-2 py-0.5 rounded ${
                node.type === 'person' ? 'bg-blue-600/50' :
                node.type === 'tribe' ? 'bg-green-600/50' :
                node.type === 'nation' ? 'bg-red-600/50' :
                node.type === 'clan' ? 'bg-yellow-600/50' :
                'bg-purple-600/50'
              }`}>
                {node.type}
              </span>
            )}
          </div>
        </div>

        {isExpanded && (
          <div className="ml-2 border-l-2 border-purple-500/30">
            {/* Render regular children */}
            {node.children && node.children.map((child, idx) => (
              renderNode(child, level + 1, [...parentPath, node.name])
            ))}

            {/* Render Joseph's line */}
            {node.legal_line_through_joseph && (
              <div className="ml-4">
                <div className="text-sm text-amber-300 font-semibold py-1">
                  Legal Line (through Joseph):
                </div>
                {renderNode(node.legal_line_through_joseph, level + 1, [...parentPath, node.name])}
              </div>
            )}

            {/* Render Mary's line */}
            {node.line_through_mary && (
              <div className="ml-4">
                <div className="text-sm text-amber-300 font-semibold py-1">
                  Biological Line (through Mary):
                </div>
                {renderNode(node.line_through_mary, level + 1, [...parentPath, node.name])}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Error view
  if (loadError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 p-4 flex items-center justify-center">
        <div className="bg-slate-800 rounded-2xl p-8 border-2 border-red-500 max-w-lg w-full">
          <h2 className="text-2xl font-bold text-red-400 mb-3">Error Loading Lineage</h2>
          <p className="text-white mb-6">{loadError}</p>
          <div className="flex gap-3">
            <button
              onClick={() => { setLoadError(null); loadAvailableTrees(); }}
              className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-4 rounded-lg transition-all"
            >
              Retry
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-slate-600 hover:bg-slate-500 text-white font-bold py-3 px-4 rounded-lg transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Tree selection view
  if (!currentTree) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Users className="w-10 h-10 text-purple-400" />
              <h1 className="text-4xl font-bold text-white">Biblical Bloodlines</h1>
            </div>
            <button
              onClick={onClose}
              className="text-purple-300 hover:text-white transition-colors"
            >
              <X size={32} />
            </button>
          </div>

          {/* Description */}
          <div className="bg-slate-800/50 rounded-xl p-6 mb-8 border-2 border-purple-500/30">
            <p className="text-purple-100 text-lg mb-4">
              Explore the genealogies and family trees of the Bible, from Adam to Jesus,
              including the 12 tribes of Israel, nations, and significant biblical figures.
            </p>
            <div className="flex items-center gap-2 text-amber-300">
              <Sparkles size={20} />
              <span className="font-semibold">Jesus's bloodline glows in amber</span>
            </div>
          </div>

          {/* Tree Selection Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="text-white text-xl">Loading family trees...</div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableTrees.map(tree => (
                <button
                  key={tree.id}
                  onClick={() => loadTree(tree)}
                  className="bg-slate-800 border-2 border-purple-500 hover:border-purple-400 hover:bg-slate-700 rounded-xl p-6 transition-all text-left group"
                >
                  <div className="text-4xl mb-3">{tree.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                    {tree.name}
                  </h3>
                  {tree.connections && (
                    <div className="text-xs font-semibold text-amber-300 mb-2">
                      {tree.connections}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-purple-400 text-sm">
                    <ChevronRight size={16} />
                    <span>Explore lineage</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Main tree view
  const filteredPeople = searchTerm.length > 0
    ? allPeople.filter(person =>
        (person.searchable && person.searchable.some(s => s.includes(searchTerm.toLowerCase())))
      )
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentTree(null)}
              className="text-purple-300 hover:text-white transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <div className="text-3xl">{currentTree.icon}</div>
            <h1 className="text-3xl font-bold text-white">{currentTree.name}</h1>
          </div>
          <button
            onClick={onClose}
            className="text-purple-300 hover:text-white transition-colors"
          >
            <X size={28} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search by person, wife, patriarch (e.g., David, Sarah, Abraham)"
              className="w-full bg-slate-800 border-2 border-purple-500 rounded-xl py-3 px-12 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400"
            />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedPerson(null);
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-white"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* Search Results */}
          {searchTerm && filteredPeople.length > 0 && (
            <div className="mt-2 bg-slate-800 border-2 border-purple-500 rounded-xl p-4 max-h-48 overflow-y-auto">
              {filteredPeople.slice(0, 10).map((person, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedPerson(person);
                    setSearchTerm('');
                  }}
                  className="w-full text-left px-3 py-2 rounded hover:bg-slate-700 text-white transition-colors flex items-center gap-2"
                >
                  <Users size={16} className="text-purple-400" />
                  <span className="font-semibold">{person.name}</span>
                  {person.aka && person.aka.length > 0 && (
                    <span className="text-sm text-purple-300">({person.aka[0]})</span>
                  )}
                  {person.fullPath && (
                    <span className="text-xs text-purple-400 ml-auto">{person.fullPath}</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Family Tree */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800 rounded-xl p-6 border-2 border-purple-500 overflow-x-auto" ref={treeRef}>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Users size={28} className="text-purple-400" />
                Family Tree
              </h2>
              <div className="text-white">
                {currentTree.data && renderNode(currentTree.data, 0, [])}
              </div>
            </div>
          </div>

          {/* Profile Panel */}
          <div className="lg:col-span-1">
            <div className={`bg-slate-800 rounded-xl p-6 border-2 sticky top-4 ${
              selectedPerson && jesusLineage.has(selectedPerson.name)
                ? 'border-amber-500 bg-gradient-to-br from-amber-900/20 to-slate-800'
                : 'border-purple-500'
            }`}>
              {selectedPerson ? (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    {jesusLineage.has(selectedPerson.name) && (
                      <Sparkles className="text-amber-400" size={24} />
                    )}
                    <h2 className={`text-2xl font-bold ${
                      jesusLineage.has(selectedPerson.name) ? 'text-amber-100' : 'text-white'
                    }`}>
                      {selectedPerson.name}
                    </h2>
                  </div>

                  {selectedPerson.aka && selectedPerson.aka.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-purple-300 mb-1">Also Known As:</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedPerson.aka.map((name, idx) => (
                          <span key={idx} className="px-2 py-1 bg-purple-600/50 rounded text-sm text-white">
                            {name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedPerson.type && (
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-purple-300 mb-1">Type:</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        selectedPerson.type === 'person' ? 'bg-blue-600' :
                        selectedPerson.type === 'tribe' ? 'bg-green-600' :
                        selectedPerson.type === 'nation' ? 'bg-red-600' :
                        selectedPerson.type === 'clan' ? 'bg-yellow-600' :
                        'bg-purple-600'
                      } text-white`}>
                        {selectedPerson.type.toUpperCase()}
                      </span>
                    </div>
                  )}

                  {selectedPerson.notes && (
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-purple-300 mb-2 flex items-center gap-2">
                        <BookOpen size={16} />
                        Notes:
                      </h3>
                      <p className="text-white leading-relaxed">{selectedPerson.notes}</p>
                    </div>
                  )}

                  {selectedPerson.source_refs && selectedPerson.source_refs.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-purple-300 mb-2">Scripture References:</h3>
                      <div className="space-y-1">
                        {selectedPerson.source_refs.map((ref, idx) => (
                          <div key={idx} className="text-sm text-purple-200 flex items-center gap-2">
                            <Crown size={12} className="text-purple-400" />
                            {ref}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedPerson.children && selectedPerson.children.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-purple-300 mb-2 flex items-center gap-2">
                        <Heart size={16} />
                        Children ({selectedPerson.children.length}):
                      </h3>
                      <div className="space-y-1 max-h-48 overflow-y-auto">
                        {selectedPerson.children.map((child, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedPerson(child)}
                            className="w-full text-left px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded text-white transition-colors flex items-center gap-2"
                          >
                            <ChevronRight size={14} className="text-purple-400" />
                            <span>{child.name}</span>
                            {child.type && (
                              <span className="text-xs text-purple-300 ml-auto">
                                {child.type}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {jesusLineage.has(selectedPerson.name) && (
                    <div className="mt-4 p-3 bg-amber-500/20 border border-amber-500/50 rounded-lg">
                      <div className="flex items-center gap-2 text-amber-300 text-sm font-semibold">
                        <Sparkles size={16} />
                        <span>Part of Jesus's Messianic Lineage</span>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 mx-auto mb-4 text-purple-400" />
                  <p className="text-purple-300">
                    Select a person from the tree or search to view their profile
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiblicalBloodlines;
