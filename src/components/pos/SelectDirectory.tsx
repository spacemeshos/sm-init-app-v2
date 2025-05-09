/**
 * @fileoverview Component for POS data directory selection
 * Provides interface for selecting and validating storage directory for POS data.
 * Handles both custom directory selection and default directory fallback.
 */

import React from 'react';
import styled from 'styled-components';

import { usePosDirectory } from '../../hooks/usePosDirectory';
import { useSettings } from '../../state/SettingsContext';
import { SetupTileWrapper } from '../../styles/containers';
import { BodyText, Subheader } from '../../styles/texts';
import { shortenPath } from '../../utils/directoryUtils';
import { Button } from '../button';
import { Tile } from '../tile';

interface SelectDirectoryProps {
  variant?: 'compact' | 'full';
  width?: number;
  height?: number;
  showExplanation?: boolean;
}

const CompactWrapper = styled(SetupTileWrapper)`
  margin-top: 40px;
  height: 140px;
`;

/**
 * Directory Selection Component
 *
 * Features:
 * - Native directory picker integration
 * - Directory validation
 * - Error handling
 * - Path display formatting
 * - Loading state management
 *
 * Variants:
 * - full: Complete view with explanations and full-size elements
 * - compact: Condensed view for space-constrained contexts
 */
export const SelectDirectory: React.FC<SelectDirectoryProps> = ({
  variant = 'full',
  showExplanation = false,
}) => {
  const { settings } = useSettings();
  const { selectDirectory, error, isValidating } = usePosDirectory();

  // Display either selected directory or default path
  const displayPath =
    settings.selectedDir || settings.defaultDir || 'Loading...';

  const Wrapper = variant === 'compact' ? CompactWrapper : SetupTileWrapper;

  return (
    <Wrapper>
      <Tile
        heading="Select where to store POS data"
        footer={variant === 'compact' ? shortenPath(displayPath, 30) : ''}
        errmsg={error ?? undefined}
        height={250}
      />
      <Button
        onClick={selectDirectory}
        label={isValidating ? 'Validating...' : 'Choose custom directory'}
        width={320}
        disabled={isValidating}
      />
      {variant === 'full' && showExplanation && (
        <>
          <Subheader text="Selected:" top={-180} />
          <Subheader text={shortenPath(displayPath, 50)} top={-160} />
          <BodyText
            text={`Select a reliable directory. If you don't choose one, the default directory will be used. 
              \nThe selected location should have appropriate permissions and meet space requirements.`}
          />
        </>
      )}
    </Wrapper>
  );
};
