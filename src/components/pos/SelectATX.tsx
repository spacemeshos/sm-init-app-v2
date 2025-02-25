/**
 * @fileoverview Component for ATX ID selection in POS setup
 * Provides interface for manual ATX ID input with validation and auto-fetch support.
 * ATX ID is a critical identifier used in the Proof of Space (POS) process.
 */

import React, { useEffect, useState } from 'react';

import { fetchLatestAtxId } from '../../services/postcliService';
import { useSettings } from '../../state/SettingsContext';
import { SetupContainer, SetupTileWrapper } from '../../styles/containers';
import { truncateHex, isValidHex } from '../../utils/hexUtils';
import { HexInput } from '../input';
import { Tile } from '../tile';

/**
 * ATX ID Selection Component
 *
 * Features:
 * - Auto-fetching of ATX ID from network
 * - Manual override capability
 * - Real-time validation
 * - Error handling
 * - Visual feedback
 *
 * The ATX ID can be:
 * 1. Auto-fetched from the network (default)
 * 2. Manually entered by user (64-character hex)
 * 3. Reset to auto-fetch by clearing input
 */
export const SelectATX: React.FC = () => {
  const { settings, setSettings } = useSettings();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /**
   * Fetches ATX ID from the network when in auto-fetch mode
   * Handles loading states and errors appropriately
   */
  const fetchAtxId = async () => {
    if (settings.atxIdSource !== 'api') return;
    
    setIsLoading(true);
    try {
      const response = await fetchLatestAtxId();
      setSettings((prev) => ({
        ...prev,
        atxId: response.atxId,
        atxIdError: undefined,
      }));
    } catch (error) {
      console.error('Failed to fetch ATX ID:', error);
      setSettings((prev) => ({
        ...prev,
        atxId: undefined,
        atxIdError: 'Failed to fetch ATX ID from network. You can try again or enter it manually.',
      }));
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Effect to trigger ATX ID fetch when in auto mode
   */
  useEffect(() => {
    if (settings.atxIdSource === 'api' && !settings.atxId) {
      fetchAtxId();
    }
  }, [settings.atxIdSource]);

  /**
   * Handles changes to the ATX ID input field
   * Validates input and updates settings accordingly
   *
   * Cases:
   * - Empty input: Reset to auto-fetch mode
   * - Invalid hex: Show error, clear ATX ID
   * - Valid hex: Update ATX ID, switch to manual mode
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event - Input change event
   */
  const handleAtxIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();

    if (value === '') {
      // Reset to auto-fetch mode
      setSettings((prev) => ({
        ...prev,
        atxId: undefined,
        atxIdSource: 'api',
        atxIdError: undefined,
      }));
    } else if (!isValidHex(value, 64)) {
      // Invalid hex input
      setSettings((prev) => ({
        ...prev,
        atxId: undefined,
        atxIdSource: 'manual',
        atxIdError: 'ATX ID must be a 64-character hexadecimal string',
      }));  
    } else {
      // Valid hex input
      setSettings((prev) => ({
        ...prev,
        atxId: value,
        atxIdSource: 'manual',
        atxIdError: undefined,
      }));
    }
  };

  /**
   * Format display value based on current state:
   * - If ATX ID exists: Show truncated ID and source
   * - If no ATX ID: Show auto-fetch message
   */
  const displayValue = settings.atxId
    ? `ATX ID: ${truncateHex(settings.atxId, 8)} (${settings.atxIdSource === 'manual' ? 'Manual Input' : 'Auto-fetched'})`
    : 'ATX ID will be auto-fetched';

  return (
    <SetupContainer>
      <SetupTileWrapper>
        <Tile
          heading="ATX ID (Advanced)"
          subheader="Automatically managed. But you can override it here."
          footer={isLoading ? 'Fetching ATX ID...' : displayValue}
          errmsg={settings.atxIdError}
          height={400}
          buttonText={settings.atxIdSource === 'api' && settings.atxIdError ? 'Retry Fetch' : undefined}
          onClick={settings.atxIdSource === 'api' && settings.atxIdError ? fetchAtxId : undefined}
        >
          <HexInput
            type="text"
            value={settings.atxId || ''}
            onChange={handleAtxIdChange}
            placeholder="Leave empty to use auto-fetched ATX ID"
            maxLength={64}
            fontSize={12}
            width={400}
            height={40}
            className={settings.atxIdError ? 'error' : ''}
          />
        </Tile>
      </SetupTileWrapper>
    </SetupContainer>
  );
};
