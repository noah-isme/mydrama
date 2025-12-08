// ============================================================================
// UI Components Showcase Page
// Demo page untuk menampilkan semua komponen UI
// ============================================================================

import React, { useState } from 'react';
import {
  Button,
  Input,
  Toast,
  Modal,
  Badge,
  Spinner,
  Skeleton,
  SkeletonDramaCard,
  Card,
} from '../components';

const ComponentsShowcase: React.FC = () => {
  const [showToast, setShowToast] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <div className="showcase-container">
      <h1>DramaBox UI Components Library</h1>
      <p className="subtitle">Showcase of all reusable UI components</p>

      {/* Buttons Section */}
      <section className="showcase-section">
        <h2>🔘 Buttons</h2>
        <div className="component-grid">
          <Button variant="primary">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="text">Text Button</Button>
          <Button variant="icon">❤️</Button>
          <Button variant="primary" loading={true}>Loading...</Button>
          <Button variant="primary" disabled>Disabled</Button>
          <Button variant="primary" icon={<span>🔍</span>}>With Icon</Button>
          <Button variant="primary" size="small">Small</Button>
          <Button variant="primary" size="large">Large</Button>
        </div>
      </section>

      {/* Inputs Section */}
      <section className="showcase-section">
        <h2>📝 Inputs</h2>
        <div className="component-grid">
          <Input
            label="Text Input"
            placeholder="Enter text..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <Input
            label="Email"
            type="email"
            placeholder="your@email.com"
            icon={<span>📧</span>}
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
          />
          <Input
            label="Search"
            type="search"
            placeholder="Search..."
            icon={<span>🔍</span>}
          />
          <Input
            label="With Error"
            error="This field is required"
            value=""
          />
          <Input
            label="With Helper"
            helperText="Enter at least 6 characters"
            placeholder="Username"
          />
        </div>
      </section>

      {/* Badges Section */}
      <section className="showcase-section">
        <h2>🏷️ Badges</h2>
        <div className="component-grid">
          <Badge variant="primary">Primary</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="error">Error</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="info">Info</Badge>
          <Badge variant="neutral">Neutral</Badge>
          <Badge variant="primary" size="small">5</Badge>
          <Badge variant="success" size="large">99+</Badge>
          <Badge variant="error" dot />
        </div>
      </section>

      {/* Cards Section */}
      <section className="showcase-section">
        <h2>🃏 Cards</h2>
        <div className="cards-grid">
          <Card variant="default">
            <h3>Default Card</h3>
            <p>Basic card with border</p>
          </Card>
          <Card variant="elevated">
            <h3>Elevated Card</h3>
            <p>Card with shadow</p>
          </Card>
          <Card variant="outlined">
            <h3>Outlined Card</h3>
            <p>Card with thicker border</p>
          </Card>
          <Card
            hoverable
            header={<h3>Card with Header</h3>}
            footer={<Button variant="primary">Action</Button>}
          >
            <p>This card has header and footer sections</p>
          </Card>
        </div>
      </section>

      {/* Toast Section */}
      <section className="showcase-section">
        <h2>🍞 Toast Notifications</h2>
        <div className="component-grid">
          <Button onClick={() => setShowToast(true)}>Show Toast</Button>
        </div>
        {showToast && (
          <Toast
            message="This is a success message!"
            type="success"
            duration={3000}
            onClose={() => setShowToast(false)}
          />
        )}
      </section>

      {/* Modal Section */}
      <section className="showcase-section">
        <h2>🪟 Modal</h2>
        <div className="component-grid">
          <Button onClick={() => setShowModal(true)}>Open Modal</Button>
        </div>
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Modal Example"
          size="medium"
          footer={
            <>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => setShowModal(false)}>
                Confirm
              </Button>
            </>
          }
        >
          <p>This is a modal dialog with header and footer.</p>
          <p>You can close it by clicking the X button, the overlay, or pressing ESC.</p>
        </Modal>
      </section>

      {/* Spinner Section */}
      <section className="showcase-section">
        <h2>⏳ Spinners</h2>
        <div className="component-grid">
          <Spinner size="small" />
          <Spinner size="medium" />
          <Spinner size="large" />
          <Spinner size="medium" text="Loading..." />
          <Button
            variant="primary"
            onClick={() => {
              setLoading(true);
              setTimeout(() => setLoading(false), 2000);
            }}
          >
            Test Fullscreen
          </Button>
        </div>
        {loading && <Spinner fullScreen text="Loading..." />}
      </section>

      {/* Skeleton Section */}
      <section className="showcase-section">
        <h2>💀 Skeleton Loading</h2>
        <div className="component-grid">
          <div>
            <p>Text Skeleton:</p>
            <Skeleton variant="text" count={3} />
          </div>
          <div>
            <p>Circular Skeleton:</p>
            <Skeleton variant="circular" width={64} height={64} />
          </div>
          <div>
            <p>Rounded Skeleton:</p>
            <Skeleton variant="rounded" width={200} height={120} />
          </div>
        </div>
        <div className="drama-cards-grid">
          <SkeletonDramaCard />
          <SkeletonDramaCard />
          <SkeletonDramaCard />
        </div>
      </section>

      {/* Combined Example */}
      <section className="showcase-section">
        <h2>🎯 Combined Example: Login Form</h2>
        <Card variant="elevated" style={{ maxWidth: '400px', margin: '0 auto' }}>
          <form onSubmit={(e) => e.preventDefault()}>
            <Input
              label="Email"
              type="email"
              placeholder="your@email.com"
              icon={<span>📧</span>}
              fullWidth
            />
            <div style={{ marginTop: '1rem' }}>
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                icon={<span>🔒</span>}
                fullWidth
              />
            </div>
            <div style={{ marginTop: '1.5rem' }}>
              <Button variant="primary" fullWidth type="submit">
                Login
              </Button>
            </div>
            <div style={{ marginTop: '0.75rem' }}>
              <Button variant="text" fullWidth>
                Forgot Password?
              </Button>
            </div>
          </form>
        </Card>
      </section>

      <style>{`
        .showcase-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          background: var(--color-background);
          min-height: 100vh;
        }

        .showcase-container h1 {
          color: var(--color-text);
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }

        .subtitle {
          color: var(--color-text-muted);
          font-size: 1.125rem;
          margin-bottom: 3rem;
        }

        .showcase-section {
          margin-bottom: 4rem;
        }

        .showcase-section h2 {
          color: var(--color-text);
          font-size: 1.75rem;
          margin-bottom: 1.5rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid var(--color-border);
        }

        .component-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          align-items: start;
        }

        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .drama-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-top: 1rem;
        }

        /* Responsive */
        @media (max-width: 767px) {
          .showcase-container {
            padding: 1rem;
          }

          .showcase-container h1 {
            font-size: 2rem;
          }

          .component-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default ComponentsShowcase;
