/**
 * @fileoverview Component for ATX ID selection in POS setup
 * Provides interface for manual ATX ID input with validation and auto-fetch support.
 * ATX ID is a critical identifier used in the Proof of Space (POS) process.
 */

import React from 'react';

import { useSettings } from '../../state/SettingsContext';
import { SetupContainer, SetupTileWrapper } from '../../styles/containers';
import { truncateHex, isValidHex } from '../../utils/hexUtils';
import { HexInput } from '../input';
import { Tile } from '../tile';
import { Button } from '../button';

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
  const { settings, setSettings, fetchAtxId } = useSettings();

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
    const value = event.target.value;

    if (value === '') {
      // Reset to auto-fetch mode
      setSettings((prev) => ({
        ...prev,
        atxId: undefined,
        atxIdSource: 'api',
        atxIdError: undefined,
        atxIdFetching: false,
      }));
    } else {
      // Invalid hex input
      setSettings((prev) => ({
        ...prev,
        atxId: value,
        atxIdSource: 'manual',
        atxIdError: !isValidHex(value, 64) ? 'ATX ID must be a 64-character hexadecimal string' : undefined,
        atxIdFetching: false,
      }));  
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (!isValidHex(value, 64)) {
      // Invalid hex input
      setSettings((prev) => ({
        ...prev,
        atxIdSource: 'manual',
        atxIdError: 'ATX ID must be a 64-character hexadecimal string',
        atxIdFetching: false,
      }));  
    }
  };

  const RetryButton = () => (
    <Button
      label={settings.atxIdFetching ? 'Please wait...' : 'Fetch ATX ID'}
      onClick={fetchAtxId}
      width={160}
      height={56}
      margin={20}
      disabled={settings.atxIdFetching}
    />
  );

  /**
   * Format display value based on current state:
   * - If ATX ID exists: Show truncated ID and source
   * - If no ATX ID: Show auto-fetch message
   */

  return (
    <SetupContainer>
      <SetupTileWrapper>
        <Tile
          heading="ATX ID"
          subheader={
            <>
              Highest ATX ID is fetched from the public API automatically.
              <br />
              But you can also enter it manually.
            </>
          }
          footer={<RetryButton />}
          errmsg={settings.atxIdError}
          height={400}
        >
          <HexInput
            type="text"
            value={settings.atxId || ''}
            onChange={handleAtxIdChange}
            onBlur={handleBlur}
            placeholder={settings.atxIdFetching ? 'Fetching ATX ID...' : 'Please fetch ATX ID or enter it manually'}
            disabled={settings.atxIdFetching}
            maxLength={64}
            fontSize={12}
            width={500}
            height={40}
            className={settings.atxIdError ? 'error' : ''}
          />
        </Tile>
      </SetupTileWrapper>
    </SetupContainer>
  );
};
