"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.permissions = void 0;
exports.permissions = {
    'workspace': {
        'manage': ["OWNER", "ADMIN"], // invite, team
        'view': ["OWNER", "ADMIN", "MEMBER", "VIEWER"],
    },
    'team': {
        'manage': ["OWNER", "ADMIN", "TEAM_ADMIN"], // team admins
        'edit': ["OWNER", "ADMIN", "TEAM_ADMIN", "TEAM_MEMBER"],
        'view': ["OWNER", "ADMIN", "TEAM_ADMIN", "TEAM_MEMBER", "TEAM_VIEWER"],
    },
    'folder': {
        'create': ["OWNER", "ADMIN", "MEMBER", "TEAM_ADMIN"],
        'upload': ["OWNER", "ADMIN", "MEMBER", "TEAM_ADMIN", "TEAM_MEMBER"],
        'delete': ["OWNER", "ADMIN", "TEAM_ADMIN"],
        'view': ["OWNER", "ADMIN", "MEMBER", "VIEWER", "TEAM_ADMIN", "TEAM_MEMBER", "TEAM_VIEWER"],
    },
    'file': {
        'view': ["OWNER", "ADMIN", "MEMBER", "VIEWER", "TEAM_ADMIN", "TEAM_MEMBER", "TEAM_VIEWER"],
        'delete': ["OWNER", "ADMIN", "TEAM_ADMIN"],
        'update': ["OWNER", "ADMIN", "MEMBER", "TEAM_ADMIN", "TEAM_MEMBER"],
    },
};
