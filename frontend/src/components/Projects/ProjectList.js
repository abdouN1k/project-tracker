import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const { API } = useAuth();

  const fetchProjects = useCallback(async () => {
    try {
      const { data } = await API.get('/projects');
      setProjects(data);
    } catch (err) {
      console.error(err);
    }
  }, [API]);

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>قائمة المشاريع</h2>
      <ul>
        {projects.map((proj) => (
          <li key={proj._id}>
            <Link to={`/projects/${proj._id}`}>{proj.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectList;