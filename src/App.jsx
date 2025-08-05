// App.jsx
import Sky from './components/Sky';
import SkyObjects from './components/SkyObjects';
import Raindrop from './components/Raindrop';
import Tree from './components/Tree';
import Leaves from './components/Leaves';
import Cursor from './components/Cursor';
import Hero from './sections/Hero';

export default function App() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <Sky />
      <SkyObjects />
      <Hero />
      <Raindrop />
      <Tree />
      <Leaves />
      <Cursor />
    </div>
  );
}