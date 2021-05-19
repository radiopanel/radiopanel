import { ResourceQuery } from './resources/resources.query';
import { ResourceService } from './resources/resources.service';
import { ResourceStore } from './resources/resources.store';
import { SessionQuery } from './session/session.query';
import { SessionService } from './session/session.service';
import { SessionStore } from './session/session.store';
import { StatusQuery } from './status/status.query';
import { StatusService } from './status/status.service';
import { StatusStore } from './status/status.store';
import { RoleQuery } from './roles/roles.query';
import { RoleService } from './roles/roles.service';
import { RoleStore } from './roles/roles.store';
import { PermissionQuery } from './permissions/permissions.query';
import { PermissionService } from './permissions/permissions.service';
import { PermissionStore } from './permissions/permissions.store';
import { SlotTypeQuery } from './slot-types/slot-types.query';
import { SlotTypeService } from './slot-types/slot-types.service';
import { SlotTypeStore } from './slot-types/slot-types.store';
import { CategoryQuery } from './categories/categories.query';
import { CategoryService } from './categories/categories.service';
import { CategoryStore } from './categories/categories.store';
import { BanQuery } from './ban/ban.query';
import { BanService } from './ban/ban.service';
import { BanStore } from './ban/ban.store';
import { ContentTypeFieldQuery } from './content-type-field/content-type-field.query';
import { ContentTypeFieldService } from './content-type-field/content-type-field.service';
import { ContentTypeFieldStore } from './content-type-field/content-type-field.store';

export { ResourceQuery } from './resources/resources.query';
export { ResourceService } from './resources/resources.service';
export { ResourceStore } from './resources/resources.store';
export { SessionQuery } from './session/session.query';
export { SessionService } from './session/session.service';
export { SessionStore } from './session/session.store';
export { StatusQuery } from './status/status.query';
export { StatusService } from './status/status.service';
export { StatusStore } from './status/status.store';
export { RoleQuery } from './roles/roles.query';
export { RoleService } from './roles/roles.service';
export { RoleStore } from './roles/roles.store';
export { PermissionQuery } from './permissions/permissions.query';
export { PermissionService } from './permissions/permissions.service';
export { PermissionStore } from './permissions/permissions.store';
export { SlotTypeQuery } from './slot-types/slot-types.query';
export { SlotTypeService } from './slot-types/slot-types.service';
export { SlotTypeStore } from './slot-types/slot-types.store';
export { CategoryQuery } from './categories/categories.query';
export { CategoryService } from './categories/categories.service';
export { CategoryStore } from './categories/categories.store';
export { BanQuery } from './ban/ban.query';
export { BanService } from './ban/ban.service';
export { BanStore } from './ban/ban.store';
export { ContentTypeFieldQuery } from './content-type-field/content-type-field.query';
export { ContentTypeFieldService } from './content-type-field/content-type-field.service';
export { ContentTypeFieldStore } from './content-type-field/content-type-field.store';

export const StoreServices = [
	ResourceService,
	SessionService,
	StatusService,
	RoleService,
	PermissionService,
	SlotTypeService,
	CategoryService,
	BanService,
	ContentTypeFieldService,
];

export const Stores = [
	ContentTypeFieldStore,
	ResourceStore,
	SessionStore,
	StatusStore,
	RoleStore,
	PermissionStore,
	SlotTypeStore,
	CategoryStore,
	BanStore,
];

export const Queries = [
	ResourceQuery,
	SessionQuery,
	StatusQuery,
	RoleQuery,
	PermissionQuery,
	SlotTypeQuery,
	CategoryQuery,
	BanQuery,
	ContentTypeFieldQuery,
];

