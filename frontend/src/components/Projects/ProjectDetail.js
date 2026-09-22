import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProjectDetail = () => {
  const { id } = useParams();
  const { API } = useAuth();
  const [project, setProject] = useState(null);

  const fetchProject = useCallback(async () => {
    try {
      const { data } = await API.get(`/projects/${id}`);
      setProject(data);
    } catch (err) {
      console.error(err);
    }
  }, [API, id]);

  useEffect(() => {
    fetchProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!project) return <div>جاري التحميل...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>{project.title}</h2>
      <p>{project.description}</p>
      <p>الحالة: {project.status}</p>
    </div>
  );
};

export default ProjectDetail;