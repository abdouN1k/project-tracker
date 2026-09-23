              {/* N'afficher ces boutons que si l'utilisateur N'EST PAS un Directeur */}
              {user?.role !== 'Directeur' && (
                <>
                  <button className="btn btn-outline" style={{ fontSize: 12, padding: '6px 12px' }} onClick={() => setActiveForm(activeForm === 'rapport' ? null : 'rapport')}>
                    <FaFileAlt /> Rapport Journalier
                  </button>
                  <button className="btn btn-primary" style={{ fontSize: 12, padding: '6px 12px' }} onClick={() => setActiveForm(activeForm === 'attachement' ? null : 'attachement')}>
                    <FaClipboardCheck /> Attachement
                  </button>
                </>
              )}