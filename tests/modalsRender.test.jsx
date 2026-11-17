import { describe, it, expect } from 'vitest';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import DTMExamModal from '../src/modules/exam/DTMExamModal';
import SubscriptionModal from '../src/modules/monetization/SubscriptionModal';
import PaywallModal from '../src/components/PaywallModal';
import FlashcardsModal from '../src/modules/monetization/FlashcardsModal';
import ErrorDrillModal from '../src/modules/monetization/ErrorDrillModal';
import DailyPracticeModal from '../src/modules/retention/DailyPracticeModal';
import VisualToolsModal from '../src/modules/visual/VisualToolsModal';
import TeacherModal from '../src/modules/teacher/TeacherModal';
import { formulasData } from '../src/data/formulas';

describe('All Modals Rendering Tests', () => {
  it('SubscriptionModal renders without throwing', () => {
    expect(() => {
      const html = ReactDOMServer.renderToString(
        React.createElement(SubscriptionModal, { isOpen: true, onClose: () => {} })
      );
      expect(html.length).toBeGreaterThan(0);
    }).not.toThrow();
  });

  it('PaywallModal renders without throwing', () => {
    expect(() => {
      const html = ReactDOMServer.renderToString(
        React.createElement(PaywallModal, { isOpen: true, onClose: () => {} })
      );
      expect(html.length).toBeGreaterThan(0);
    }).not.toThrow();
  });

  it('ErrorDrillModal renders without throwing', () => {
    expect(() => {
      const html = ReactDOMServer.renderToString(
        React.createElement(ErrorDrillModal, { isOpen: true, onClose: () => {} })
      );
      expect(html.length).toBeGreaterThan(0);
    }).not.toThrow();
  });

  it('DailyPracticeModal renders without throwing', () => {
    expect(() => {
      const html = ReactDOMServer.renderToString(
        React.createElement(DailyPracticeModal, { isOpen: true, onClose: () => {}, currentStreak: 1 })
      );
      expect(html).toBeDefined();
    }).not.toThrow();
  });

  it('VisualToolsModal renders without throwing', () => {
    expect(() => {
      const html = ReactDOMServer.renderToString(
        React.createElement(VisualToolsModal, { formula: formulasData[0], onClose: () => {} })
      );
      expect(html.length).toBeGreaterThan(0);
    }).not.toThrow();
  });

  it('TeacherModal renders without throwing', () => {
    expect(() => {
      const html = ReactDOMServer.renderToString(
        React.createElement(TeacherModal, { isOpen: true, onClose: () => {} })
      );
      expect(html.length).toBeGreaterThan(0);
    }).not.toThrow();
  });
});
