

function ListResults({items}) {
  return (
    {/* Content Grid/List */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {/* Folders */}
                {currentFolder.folders.map((folder) => (
                  <Card key={folder.id} className="group hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigateToFolder(folder.id)}>
                    <CardContent className="p-3">
                      <div className="relative">
                        <div className="w-full h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mb-3">
                          <Folder className="h-12 w-12 text-blue-600" />
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-gray-700 truncate font-medium">{folder.name}</p>
                    </CardContent>
                  </Card>
                ))}
                
                {/* Files */}
                {currentFolder.files.map((file) => (
                  <Card key={file.id} className="group hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-3">
                      <div className="relative">
                        <div className="w-full h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center mb-3">
                          <div className="text-2xl">📄</div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-gray-700 truncate">{file.name}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {/* Folders in list view */}
                {currentFolder.folders.map((folder) => (
                  <div key={folder.id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg cursor-pointer" onClick={() => navigateToFolder(folder.id)}>
                    <Folder className="h-8 w-8 text-blue-600" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{folder.name}</p>
                      <p className="text-sm text-gray-500">Folder</p>
                    </div>
                    <div className="text-sm text-gray-500">—</div>
                    <div className="text-sm text-gray-500">—</div>
                  </div>
                ))}
                
                {/* Files in list view */}
                {currentFolder.files.map((file) => (
                  <div key={file.id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded flex items-center justify-center">
                      <span className="text-sm">📄</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-500">{file.type}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={file.uploaderAvatar} alt={file.uploader} />
                        <AvatarFallback className="text-xs">{file.uploader.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-gray-600">{file.uploader}</span>
                    </div>
                    <div className="text-sm text-gray-500 min-w-20">{file.updatedAt}</div>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
  )
}

export default ListResults