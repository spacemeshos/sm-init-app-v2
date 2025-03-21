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
   * Handles loading states and errors appropriately with detailed logging
   */
  const fetchAtxId = async () => {
    if (settings.atxIdSource !== 'api') {
      console.log('Skipping ATX ID fetch - not in API mode');
      return;
    }
    
    console.log('Starting ATX ID fetch process...');
    setIsLoading(true);
    
    try {
      console.log('Calling fetchLatestAtxId service...');
      const startTime = Date.now();
      const response = await fetchLatestAtxId();
      const fetchDuration = Date.now() - startTime;
      
      console.log(`ATX ID fetch successful in ${fetchDuration}ms:`, response.atxId);
      
      setSettings((prev) => ({
        ...prev,
        atxId: response.atxId,
        atxIdError: undefined,
      }));
      
      console.log('ATX ID successfully updated in settings');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Failed to fetch ATX ID:', {
        error: error,
        message: errorMessage
      });
      
      // Provide more specific error messages based on error type
      let userErrorMessage = 'Failed to fetch ATX ID from network. ';
      
      if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
        userErrorMessage += 'Network connectivity issue detected. Check your internet connection.';
      } else if (errorMessage.includes('parse') || errorMessage.includes('JSON')) {
        userErrorMessage += 'Received invalid data from the server. API format may have changed.';
      } else if (errorMessage.includes('missing required')) {
        userErrorMessage += 'API response is missing required data. The service may be experiencing issues.';
      } else if (errorMessage.includes('status')) {
        userErrorMessage += `API server error: ${errorMessage}`;
      } else {
        userErrorMessage += 'You can try again or enter it manually.';
      }
      
      console.log('Setting error message for user:', userErrorMessage);
      
      setSettings((prev) => ({
        ...prev,
        atxId: undefined,
        atxIdError: userErrorMessage,
      }));
    }
    setIsLoading(false);
    console.log('ATX ID fetch process completed, loading state reset');
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
