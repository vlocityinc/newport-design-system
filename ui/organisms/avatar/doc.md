# Avatar

An avatar component represents an object or entity

An avatar can be circular or a rounded rectangle, depending on usage. The
default is a rounded rectangle and requires `.nds-avatar` as the base class.
Use a circle for all people-oriented objects that could potentially render
as avatars. For a fully round avatar, add the `.nds-avatar_circle` class.
Four additional classes are available for sizing.

If an image is unavailable, up to two letters can be used instead. If the
record name contains two words, like first and last name, use the first
capitalized letter of each. For records that only have a single word name,
use the first two letters of that word using one capital and one lower case
letter. If either an image or initials are unavailable, use the object icon as a fallback.
