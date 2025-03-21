/**
 * @fileoverview Component for Smesher identity configuration
 * Handles public key input and validation for POS identity setup.
 * Supports both manual key entry and automatic identity creation.
 */

import React, { useState } from 'react';

import { useSettings } from '../../state/SettingsContext';
import { SetupContainer, SetupTileWrapper } from '../../styles/containers';
import { truncateHex, isValidHex } from '../../utils/hexUtils';
import { HexInput } from '../input';
import { Tile } from '../tile';

/**
 * Identity Selection Component
 *
 * Features:
 * - Manual public key input
 * - Real-time hex validation
 * - Error handling and feedback
 * - Automatic identity fallback
 *
 * The component handles:
 * 1. Public Key Input:
 *    - 64-character hex validation
 *    - Case normalization (lowercase)
 *    - Optional input (can be left empty)
 *
 * 2. Error States:
 *    - Invalid hex format
 *    - Incorrect length
 *    - Visual error feedback
 *
 * 3. Identity Management:
 *    - Manual key configuration
 *    - Automatic identity creation when no key provided
 */
export const SelectIdentity: React.FC = () => {
  const { setSettings } = useSettings();
  // Local state for public key input
  const [publicKey, setPublicKey] = useState<string>('');
  // Track validation errors
  const [error, setError] = useState<string | undefined>(undefined);

  /**
   * Handles changes to the public key input
   * Validates input and updates settings accordingly
   *
   * Cases:
   * - Empty input: Clear key and error
   * - Invalid hex: Show error, clear key
   * - Valid hex: Update key, clear error
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event - Input change event
   */
  const handlePublicKeyChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value.toLowerCase();
    setPublicKey(value);

    if (value === '') {
      // Handle empty input - reset to automatic identity
      setError(undefined);
      setSettings((prev) => ({ ...prev, publicKey: undefined }));
    } else if (!isValidHex(value, 64)) {
      // Handle invalid input - show error
      setError('Public key must be a 64-character hexadecimal string');
      setSettings((prev) => ({ ...prev, publicKey: undefined }));
    } else {
      // Handle valid input - update settings
      setError(undefined);
      setSettings((prev) => ({
        ...prev,
        publicKey: value,
      }));
    }
  };

  return (
    <SetupContainer>
      <SetupTileWrapper>
        <Tile
          heading="Enter your Smesher Identity"
          subheader={
            publicKey && !error
              ? `Custom ID will be used: ${truncateHex(publicKey, 8)}`
              : 'Leave it blank to create a new identity automatically'
          }
          errmsg={error ?? undefined}
          width={600}
        >
          <HexInput
            type="text"
            fontSize={12}
            value={publicKey}
            onChange={handlePublicKeyChange}
            placeholder="Enter your Public Key (hex, optional)"
            maxLength={64}
            width={300}
            className={error ? 'error' : ''}
          />
        </Tile>
      </SetupTileWrapper>
    </SetupContainer>
  );
};
