
import { Container, Typography, Grid, Card, CardContent, CardActions, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const projects = [
  { id: 1, title: 'E-Commerce Platform', description: 'A fully functional e-commerce platform built using MERN stack.' },
  { id: 2, title: 'Social Media App', description: 'A social media application with real-time chat and post features.' },
  { id: 3, title: 'Portfolio Website', description: 'A personal portfolio website showcasing projects and skills.' },
];

function Projects() {
  return (
    <Container maxWidth="lg" style={{ marginTop: '20px' }}>
      <Typography variant="h3" gutterBottom>
        My Projects
      </Typography>
      <Grid container spacing={4}>
        {projects.map((project) => (
          <Grid item xs={12} sm={6} md={4} key={project.id}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div">
                  {project.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {project.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" component={Link} to={`/feed`}>
                  Learn More
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Projects;
